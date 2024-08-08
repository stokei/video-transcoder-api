import { BullModule } from '@nestjs/bullmq';

import { NotifyVideoStatusQueueConsumer } from './notify-video-status';
import { NOTIFY_VIDEO_STATUS_QUEUE_CONFIG } from './notify-video-status/config';
import { TranscodeVideoQueueConsumer } from './transcode-video';
import { TRANSCODE_VIDEO_QUEUE_CONFIG } from './transcode-video/config';

export const Queues = [
  BullModule.registerQueue({
    name: TRANSCODE_VIDEO_QUEUE_CONFIG.name
  }),
  BullModule.registerQueue({
    name: NOTIFY_VIDEO_STATUS_QUEUE_CONFIG.name
  })
];

export const QueuesProcessors = [
  TranscodeVideoQueueConsumer,
  NotifyVideoStatusQueueConsumer
];
