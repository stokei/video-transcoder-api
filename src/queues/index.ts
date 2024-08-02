import { BullModule } from '@nestjs/bullmq';
import { TRANSCODE_VIDEO_QUEUE_CONFIG } from './transcode-video/config';
import { TranscodeVideoQueueConsumer } from './transcode-video';

export const Queues = [
  BullModule.registerQueue({
    name: TRANSCODE_VIDEO_QUEUE_CONFIG.name
  })
];

export const QueuesProcessors = [TranscodeVideoQueueConsumer];
