import { IBaseService } from '@stokei/nestjs';

import { UploadFileDTO } from '@/dtos/uploads/upload-file';

export type IBaseUploadFileService = IBaseService<
  UploadFileDTO,
  Promise<boolean>
>;
