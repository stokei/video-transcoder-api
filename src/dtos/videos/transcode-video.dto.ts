import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TranscodeVideoDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  file: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url: string;
}

/*
export interface TranscodeVideoDTO {
  file: string;
  url: string;
}
  */
