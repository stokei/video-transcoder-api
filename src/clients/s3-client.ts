import { S3Client } from '@aws-sdk/client-s3';

import {
  STORAGE_BUCKET,
  STORAGE_ENDPOINT,
  STORAGE_FILE_BASE_URL,
  STORAGE_KEY,
  STORAGE_REGION,
  STORAGE_SECRET_KEY
} from '@/environments';

export const s3Client = new S3Client({
  endpoint: STORAGE_ENDPOINT,
  forcePathStyle: true,
  region: STORAGE_REGION,
  credentials: {
    accessKeyId: STORAGE_KEY,
    secretAccessKey: STORAGE_SECRET_KEY
  }
});

export const getBucketFileURL = ({ key }: { key: string }) => {
  return `${STORAGE_FILE_BASE_URL}/${STORAGE_BUCKET}/${key}`;
};
