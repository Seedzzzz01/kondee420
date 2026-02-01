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

    } catch (error: any) {
        console.error('Upload API Error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to upload file to S3',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
