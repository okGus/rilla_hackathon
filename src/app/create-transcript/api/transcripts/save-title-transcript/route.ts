import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';

// Initialize the DynamoDB client
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' }); // Replace with your region

export async function POST(req: Request) {
  try {
    const { transcriptId, userId, newTitle } = await req.json();
    console.log('Updating transcript:', transcriptId, userId, newTitle);

    // DynamoDB Update Command
    const updateParams: UpdateCommandInput = {
      TableName: 'Transcripts',  // Replace with your actual table name
      Key: {
        PK: `TRANSCRIPT#${transcriptId}`,  // Adjust based on your partition key format
        SK: `METADATA`,  // Adjust based on your sort key format
      },
      UpdateExpression: 'set title = :newTitle', // Update the title attribute
      ExpressionAttributeValues: {
        ':newTitle': newTitle,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    await dynamoDbClient.send(new UpdateCommand(updateParams));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating transcript:', error);
    return NextResponse.json({ error: 'Failed to update transcript' }, { status: 500 });
  }
}
