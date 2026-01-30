import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export async function uploadToS3(
    file: Buffer,
    fileName: string,
    contentType: string
) {
    const bucketName = process.env.AWS_BUCKET_NAME;

    if (!bucketName) {
        throw new Error("AWS_BUCKET_NAME is not defined");
    }

    // Generate a unique file name to avoid collisions
    const uniqueKey = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${fileName.replace(/\s+/g, '_')}`;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueKey,
        Body: file,
        ContentType: contentType,
    });

    try {
        await s3Client.send(command);

        // Return the public URL. Note: This assumes the bucket/file is publicly accessible 
        // or you are using a CDN like CloudFront. 
        // For S3, the standard URL format is: https://BUCKET_NAME.s3.REGION.amazonaws.com/KEY
        const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${uniqueKey}`;

        return {
            success: true,
            fileUrl,
            fileName,
            key: uniqueKey
        };
    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw error;
    }
}
