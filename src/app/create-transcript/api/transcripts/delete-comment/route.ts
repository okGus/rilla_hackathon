import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

// Initialize the DynamoDB client
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });

export async function DELETE(req: Request) {
  try {
    const { commentPK, commentSK, userID } = await req.json();

    // DynamoDB Delete Command
    const deleteParams = {
      TableName: 'Transcripts',
      Key: {
        PK: commentPK, // Replace with the correct partition key
        SK: commentSK,         // Use the commentId as the sort key
      },
    };

    await dynamoDbClient.send(new DeleteCommand(deleteParams));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
