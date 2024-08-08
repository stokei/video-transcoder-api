import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { IBaseService } from '@stokei/nestjs';
import { Queue } from 'bullmq';

import { NotifyVideoStatusDTO } from '@/dtos/videos/notify-video-status.dto';
import { NOTIFY_VIDEO_STATUS_QUEUE_CONFIG } from '@/queues/notify-video-status/config';

@Injectable()
export class NotifyVideoStatusService
  implements IBaseService<NotifyVideoStatusDTO, Promise<boolean>>
{
  constructor(
    @InjectQueue(NOTIFY_VIDEO_STATUS_QUEUE_CONFIG.name)
    private readonly notifyVideoStatusQueue: Queue
  ) {}

  async execute(data: NotifyVideoStatusDTO) {
    const ok = await this.notifyVideoStatusQueue.add('', data);
    return !!ok;
  }
}
