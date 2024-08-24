import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { NextResponse } from "next/server";


const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoDbClient);

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  try {
    const params = {
      TableName: 'Transcripts',
      FilterExpression: `contains(UserId , :yyyy) AND attribute_exists(title) AND title <> :emptyString`,
      ExpressionAttributeValues: {
        ":yyyy": { S: userId },
        ":emptyString": {S: ''},
      },
    }

    const command = new ScanCommand(params);
    const data = await docClient.send(command);

    return NextResponse.json({
      transcript: data.Items
    });
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to retrieve transcript' }, { status: 500 });
  }
}
