import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

interface Comment {
    text: string;
    startOffset: number;
    endOffset: number;
    comment: string;
}

interface CommentsRequest {
    transcriptId: string;
    comments: Comment[];
}

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function POST(request: Request) {
    const { transcriptId, comments }: CommentsRequest = await request.json();

    try {
        // Save comments
        const commentPromises = comments.map((comment) =>
            dynamoDb.put({
            TableName: 'Transcripts',
            Item: {
                PK: `TRANSCRIPT#${transcriptId}`,
                SK: `COMMENT#${uuidv4()}`,  // Unique ID for each comment
                Text: comment.text,
                StartOffset: comment.startOffset,
                EndOffset: comment.endOffset,
                Comment: comment.comment,
                CreatedAt: new Date().toISOString(),
            },
            }).promise()
        );

        await Promise.all(commentPromises);

        return NextResponse.json({ message: 'Comments saved successfully' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save comments' }, { status: 500 });
    }
}