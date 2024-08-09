import { S3Client } from '@aws-sdk/client-s3';

import {
  STORAGE_ENDPOINT,
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
