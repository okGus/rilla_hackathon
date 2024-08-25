// pages/api/comments/[pk].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { NextResponse } from "next/server";

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoDbClient);

export async function GET(request: Request, { params }: { params: { pk: string } }) {
    const { pk } = params;

  try {
    const command = new QueryCommand({
      TableName: 'Comments',
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': pk,
      },
    });

    const data = await docClient.send(command);

    return NextResponse.json({
        transcript: data
    });
  }  catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to retrieve comments' }, { status: 500 });
  }
}
