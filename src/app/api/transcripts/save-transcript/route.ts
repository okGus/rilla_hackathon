import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

interface TranscriptRequest {
    transcriptId: string;
    transcript: string;
}

export async function POST(request: Request) {
    // Initialize the DynamoDB client and document client
    const dynamoDbClient = new DynamoDBClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        }
    });

    const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

    const { transcript }: TranscriptRequest = await request.json();
    const transcriptId = uuidv4();
    try {
        await dynamoDbDocClient.send(new PutCommand({
            TableName: 'Transcripts',
            Item: {
                PK: `TRANSCRIPT#${transcriptId}`,
                SK: 'METADATA',
                Content: transcript,
                CreatedAt: new Date().toISOString(),
            }
        }));

        return NextResponse.json({ message: 'Transcript saved successfully', transcript: transcript, id: transcriptId }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save transcript' }, { status: 500 });
    }
}