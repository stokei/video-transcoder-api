import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  path: string;

  @IsString()
  @ApiProperty()
  contentType?: string;

  @IsBoolean()
  @ApiProperty()
  isPublic?: boolean;
}
