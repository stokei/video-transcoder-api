import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TranscodeVideoDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fileId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  source: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  notificationUrl: string;
}
