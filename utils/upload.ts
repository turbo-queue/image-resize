import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { randomUUID } from "crypto";

const bucketName = process.env.BUCKET_NAME!;

export async function upload(image: Buffer) {
  const s3Client = new S3Client();
  const key = `${randomUUID()}.jpeg`;

  // Upload the resized image to S3
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: bufferToStream(image),
      ContentType: "image/jpeg",
      ACL: "public-read", // Set ACL to public-read if the bucket is public
    })
  );

  return `https://${bucketName}.s3.amazonaws.com/${key}`;
}

function bufferToStream(buffer: Buffer) {
  const readable = new Readable();
  readable._read = () => {}; // _read is required but you can noop it
  readable.push(buffer);
  readable.push(null);
  return readable;
}
