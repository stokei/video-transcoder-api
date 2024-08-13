import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { VideoStatus } from '@/enums/video-status.enum';

export class NotifyVideoStatusDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fileId: string;

  @IsEnum(VideoStatus)
  @IsNotEmpty()
  @ApiProperty()
  status: VideoStatus;

  @IsString()
  @ApiProperty()
  notificationUrl: string;

  @IsString()
  @ApiProperty()
  errorMessage?: string;

  @IsNumber()
  @ApiProperty()
  duration: number;

  @IsNumber()
  @ApiProperty()
  size: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  mimetype: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  extension: string;
}
