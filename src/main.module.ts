import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { Controllers } from './controllers';
import {
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_TLS,
  REDIS_USERNAME
} from './environments';
import { Queues, QueuesProcessors } from './queues';
import { Services } from './services';

@Module({
  imports: [
    HttpModule,
    TerminusModule,
    BullModule.forRoot({
      defaultJobOptions: {
        attempts: 3
      },
      connection: {
        ...(REDIS_TLS && {
          tls: {
            rejectUnauthorized: false
          }
        }),
        host: REDIS_HOST,
        port: REDIS_PORT,
        username: REDIS_USERNAME,
        password: REDIS_PASSWORD
      }
    }),
    ...Queues
  ],
  controllers: Controllers,
  providers: [...Services, ...QueuesProcessors]
})
export class MainModule {}
