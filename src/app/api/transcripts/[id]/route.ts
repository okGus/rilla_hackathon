import { NextResponse } from "next/server";
import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const result = await dynamoDB.query({
            TableName: 'Transcripts',
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
                ':pk': `TRANSCRIPT#${id}`,
            },
        }).promise();

        // Get transcript from Sort Key
        const transcriptItem = result.Items?.find(item => item.SK === 'METADATA');
        // Get comment from Sort Key
        const commentsItems = (result.Items || []).filter(item => item.SK.startsWith('COMMENT#'));

        if (!transcriptItem) {
            return NextResponse.json({ error: 'Transcript not found' }, { status: 404 });
        }

        return NextResponse.json({
            transcript: transcriptItem,
            comments: commentsItems,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to retrieve transcript and comments' }, { status: 500 });
    }
}