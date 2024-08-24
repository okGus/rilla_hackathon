import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

interface Comment {
    text: string;
    startOffset: number;
    endOffset: number;
    comment: string;
}

interface TranscriptRequest {
    transcript: string;
    comments: Comment[];
}

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function POST(request: Request) {
    const { transcript, comments }: TranscriptRequest = await request.json();
    const transcriptID = uuidv4(); // Generate uuid for transcript

    try {
        // Save transcript
        await dynamoDB.put({
            TableName: 'Transcripts',
            Item: {
                PK: `TRANSCRIPT#${transcriptID}`,
                SK: 'METADATA',
                Content: transcript,
                CreatedAt: new Date().toISOString(),
            },
        }).promise();

        // Save comments
        const commentPromises = comments.map((comment, index) =>
            dynamoDB.put({
              TableName: 'Transcripts',
              Item: {
                    PK: `TRANSCRIPT#${transcriptID}`,
                    SK: `COMMENT#${index + 1}`,
                    Text: comment.text,
                    StartOffset: comment.startOffset,
                    EndOffset: comment.endOffset,
                    Comment: comment.comment,
                    CreatedAt: new Date().toISOString(),
                },
            }).promise()
        );

        await Promise.all(commentPromises);

        return NextResponse.json({ id: transcriptID }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save transcript and comments' }, { status: 500 });
    }
}