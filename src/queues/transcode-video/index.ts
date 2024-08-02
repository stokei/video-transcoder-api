import { TranscodeVideoDTO } from '@/dtos/videos/transcode-video.dto';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { TRANSCODE_VIDEO_QUEUE_CONFIG } from './config';

@Processor(TRANSCODE_VIDEO_QUEUE_CONFIG.name)
export class TranscodeVideoQueueConsumer extends WorkerHost {
  private readonly logger = new Logger(TranscodeVideoQueueConsumer.name);

  async process(job: Job<TranscodeVideoDTO, any, string>) {
    const progress = await job.progress;
    this.logger.log('Entro no job -> ' + job.id);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.logger.log('Acabou o job -> ' + job.id);
  }
}
