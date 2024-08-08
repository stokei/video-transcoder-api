import { HttpService } from '@nestjs/axios';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { firstValueFrom } from 'rxjs';

import { NotifyVideoStatusDTO } from '@/dtos/videos/notify-video-status.dto';
import { NOTIFY_VIDEO_STATUS_URL } from '@/environments';

import { NOTIFY_VIDEO_STATUS_QUEUE_CONFIG } from './config';

@Processor(NOTIFY_VIDEO_STATUS_QUEUE_CONFIG.name)
export class NotifyVideoStatusQueueConsumer extends WorkerHost {
  private readonly logger = new Logger(NotifyVideoStatusQueueConsumer.name);

  constructor(private readonly httpService: HttpService) {
    super();
  }

  async process(job: Job<NotifyVideoStatusDTO, any, string>) {
    const data = job.data;
    try {
      const responseNotifyVideoStatus = await firstValueFrom(
        this.httpService.post(NOTIFY_VIDEO_STATUS_URL, data)
      );
      if (responseNotifyVideoStatus) {
        return;
      }
    } catch (error) {
      this.logger.warn(
        `Error: Notify video status on Job(#${job.id}) -> ${JSON.stringify(data)}`
      );
    }
  }
}
