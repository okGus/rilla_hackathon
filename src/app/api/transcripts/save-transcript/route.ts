import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

interface TranscriptRequest {
    transcriptId: string;
    transcript: string;
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function POST(request: Request) {
    const { transcriptId, transcript }: TranscriptRequest = await request.json();

    try {
        await dynamoDb.put({
        TableName: 'Transcripts',
        Item: {
            PK: `TRANSCRIPT#${transcriptId}`,
            SK: 'METADATA',
            Content: transcript,
            CreatedAt: new Date().toISOString(),
        },
        }).promise();

        return NextResponse.json({ message: 'Transcript saved successfully' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save transcript' }, { status: 500 });
    }
}