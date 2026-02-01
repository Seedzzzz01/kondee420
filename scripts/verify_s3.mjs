
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

async function verify() {
    console.log("Verifying S3 Connectivity...");
    console.log("Region:", process.env.AWS_REGION);
    console.log("Bucket:", process.env.AWS_BUCKET_NAME);

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        console.error("❌ Credentials missing in process.env");
        process.exit(1);
    }

    const s3Client = new S3Client({
        region: process.env.AWS_REGION || "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.AWS_BUCKET_NAME,
            MaxKeys: 1
        });
        const response = await s3Client.send(command);
        console.log("✅ S3 Connectivity Verified! Successfully listed objects.");
        process.exit(0);
    } catch (error) {
        console.error("❌ S3 Connectivity Failed:", error.message);
        process.exit(1);
    }
}

verify();
