import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to AWS S3
        const result = await uploadToS3(buffer, file.name, file.type);

        return NextResponse.json({
            success: true,
            fileUrl: result.fileUrl,
            fileName: result.fileName,
            fileSize: file.size,
            type: file.type.startsWith('image/') ? 'ISSUE_PHOTO' : file.type.startsWith('video/') ? 'ISSUE_VIDEO' : 'OTHER'
        });

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Failed to upload file to S3' }, { status: 500 });
    }
}
