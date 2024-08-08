import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ParamNotFoundException } from '@stokei/nestjs';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

import { s3Client } from '@/clients/s3-client';
import { UploadFileDTO } from '@/dtos/uploads/upload-file';
import { STORAGE_BUCKET } from '@/environments';

import { IBaseUploadFileService } from './types';

@Injectable()
export class UploadFileService implements IBaseUploadFileService {
  async execute(data: UploadFileDTO) {
    const existsFile = existsSync(data?.path);
    if (!existsFile) {
      throw new ParamNotFoundException('file');
    }
    const command = new PutObjectCommand({
      Bucket: STORAGE_BUCKET,
      Key: data.path,
      Body: await readFile(data.path),
      ACL: data?.isPublic ? 'public-read' : 'private',
      ContentType: data?.contentType
    });
    const response = await s3Client.send(command);
    return !!response;
  }
}
