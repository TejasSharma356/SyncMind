const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

dotenv.config({ path: 'c:/Users/aztec/Downloads/CLUELY-RIPOFF/.env' });

async function listMyBuckets() {
    const s3Client = new S3Client({
        region: process.env.AWS_REGION || "us-east-1",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });

    try {
        const data = await s3Client.send(new ListBucketsCommand({}));
        console.log("SUCCESS. Found buckets:");
        data.Buckets.forEach(b => console.log(` - ${b.Name}`));
    } catch (err) {
        console.error("FAILED to list buckets:", err);
    }
}

listMyBuckets();
