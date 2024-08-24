import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

// Initialize S3 client
const client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
    }
});

// Define type for expected file
interface FileWithMetadata extends Blob {
    readonly name: string;
    readonly type: string;
}

async function uploadFileToS3(fileBuffer: Buffer, filename: string, contentType: string) {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${filename}-${Date.now()}`,
        Body: fileBuffer,
        ContentType: contentType
    }

    const command = new PutObjectCommand(params);

    await client.send(command);
    return params.Key;;
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as FileWithMetadata | null;

        if (!file) {
            return NextResponse.json({ error: 'File not found in the request' }, { status: 400 });
        }

        // Convert file to buffer and determine content type
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const contentType = file.type;
        const fileName = await uploadFileToS3(fileBuffer, file.name, contentType);
        // Construct the file URL

        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;

        return NextResponse.json({ success: true, fileURL: fileUrl });
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}