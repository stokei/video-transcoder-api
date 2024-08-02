import { TranscodeVideoDTO } from '@/dtos/videos/transcode-video.dto';
import { TRANSCODE_VIDEO_QUEUE_CONFIG } from '@/queues/transcode-video/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { IBaseService } from '@stokei/nestjs';
import { Queue } from 'bullmq';

@Injectable()
export class TranscodeVideoService
  implements IBaseService<TranscodeVideoDTO, Promise<boolean>>
{
  constructor(
    @InjectQueue(TRANSCODE_VIDEO_QUEUE_CONFIG.name)
    private readonly transcodeVideoQueue: Queue
  ) {}

  async execute(data: TranscodeVideoDTO) {
    const ok = await this.transcodeVideoQueue.add('', data);
    return !!ok;
  }
}
