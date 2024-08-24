import { NextResponse } from 'next/server';
// import AWS from 'aws-sdk';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

type Comment = {
    transcriptId: string;
    content: string;
    position: { top: number; left: number };
};

interface CommentsRequest {
    comment: Comment;
    userId: string;
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
    const { comment, userId }: CommentsRequest = await request.json();

    try {
        // Save comments
        await dynamoDbDocClient.send(new PutCommand({
            TableName: 'Transcripts',
            Item: {
                PK: `TRANSCRIPT#${comment.transcriptId}`,
                SK: `COMMENT#${uuidv4()}`,  // Unique ID for each comment
                Comment: comment,
                UserId: userId,
                CreatedAt: new Date().toISOString(),
            },
        }))

        // await Promise.all(commentPromises);

        return NextResponse.json({ message: 'Comments saved successfully' }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save comments' }, { status: 500 });
    }
}