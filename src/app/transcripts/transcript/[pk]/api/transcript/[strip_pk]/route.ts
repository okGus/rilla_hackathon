// pages/api/transcript/[pk].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { NextResponse } from "next/server";


const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoDbClient);

export async function GET(request: Request, { params }: { params: { strip_pk: string } }) {
    const { strip_pk } = params;
    console.log(strip_pk)

    const pk = `TRANSCRIPT#${strip_pk}`

  try {
    const paramaters = {
        TableName: 'Transcripts',
        FilterExpression: 'PK = :pk',
        ExpressionAttributeValues: {
            ':pk': {S: pk}, // Use userId directly if values are hardcoded
        },
    };

    const command = new ScanCommand(paramaters);
    const data = await docClient.send(command);

    return NextResponse.json({
        transcript: data
    });
  }  catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to retrieve transcript' }, { status: 500 });
  }
}
