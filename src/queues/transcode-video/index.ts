import { Processor, WorkerHost } from '@nestjs/bullmq';
import axios from 'axios';
import { Job } from 'bullmq';
import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import { join } from 'path';
import { PassThrough } from 'stream';

import { ffmpeg } from '@/clients/ffmpeg';
import { getBucketFileURL } from '@/clients/s3-client';
import { TranscodeVideoDTO } from '@/dtos/videos/transcode-video.dto';
import { VideoStatus } from '@/enums/video-status.enum';
import { FilePathMapper } from '@/mappers/file-path';
import { UploadFileService } from '@/services/uploads/upload-file';
import { NotifyVideoStatusService } from '@/services/videos/notify-video-status';

import { TRANSCODE_VIDEO_QUEUE_CONFIG } from './config';

@Processor(TRANSCODE_VIDEO_QUEUE_CONFIG.name)
export class TranscodeVideoQueueConsumer extends WorkerHost {
  constructor(
    private readonly uploadFileService: UploadFileService,
    private readonly notifyVideoStatusService: NotifyVideoStatusService
  ) {
    super();
  }

  async process(job: Job<TranscodeVideoDTO, any, string>) {
    const data = job.data;
    await this.notifyVideoStatusService.execute({
      fileId: data.fileId,
      status: VideoStatus.ENCODING,
      duration: 0,
      size: 0
    });
    try {
      const transcoded = await this.downloadAndTranscodeVideo(data);
      if (transcoded) {
        await this.notifyVideoStatusService.execute({
          fileId: data.fileId,
          status: VideoStatus.COMPLETED,
          ...transcoded
        });
      } else {
        await this.notifyVideoStatusService.execute({
          fileId: data.fileId,
          status: VideoStatus.FAILED,
          errorMessage: `Error transcoding video for job -> ${job.id}`,
          ...transcoded
        });
      }
    } catch (error) {
      await this.notifyVideoStatusService.execute({
        fileId: data.fileId,
        status: VideoStatus.FAILED,
        duration: 0,
        size: 0,
        errorMessage: error?.message
      });
    }
  }

  private async downloadAndTranscodeVideo({
    fileId,
    source
  }: TranscodeVideoDTO): Promise<{
    url: string;
    duration: number;
    size: number;
  }> {
    try {
      return new Promise(async (resolve, reject) => {
        const filePathMapper = new FilePathMapper(fileId);
        const segmentsDir = filePathMapper.output;
        if (!existsSync(segmentsDir)) {
          await fs.mkdir(segmentsDir, { recursive: true });
        }
        const playlistPath = filePathMapper.playlist;

        const passthroughStream = new PassThrough();
        const response = await axios({
          method: 'get',
          url: source,
          responseType: 'stream'
        });
        response.data.pipe(passthroughStream);

        ffmpeg()
          .input(passthroughStream)
          .output(playlistPath)
          .outputOptions([
            '-preset superfast',
            '-g 48',
            '-hls_time 10',
            '-hls_list_size 0',
            '-hls_segment_filename',
            filePathMapper.mountSegmentName()
          ])
          .on('error', reject)
          .on('end', async () => {
            const response = await this.uploadPlaylistAndRemoveOldFiles({
              fileId
            });
            if (response) {
              return resolve({
                duration: 0,
                size: 0,
                url: getBucketFileURL({ key: filePathMapper.playlist })
              });
            }
            return resolve(undefined);
          })
          .run();
      });
    } catch (error) {}
  }

  private async uploadPlaylistAndRemoveOldFiles({
    fileId
  }: {
    fileId: string;
  }) {
    const filePathMapper = new FilePathMapper(fileId);
    const response = await this.uploadFileService.execute({
      path: filePathMapper.playlist,
      isPublic: true,
      contentType: 'application/vnd.apple.mpegurl'
    });
    if (response) {
      await this.uploadAllSegments({ fileId });
      await fs.rm(filePathMapper.output, {
        recursive: true
      });
    }
    return response;
  }

  private async uploadSegment(segmentPath: string) {
    const response = await this.uploadFileService.execute({
      path: segmentPath,
      isPublic: true
    });
    return response;
  }

  private async uploadAllSegments({ fileId }: { fileId: string }) {
    const filePathMapper = new FilePathMapper(fileId);
    const segmentsDir = filePathMapper.output;
    const segmentFiles = (await fs.readdir(segmentsDir))?.filter((file) =>
      file.endsWith('.ts')
    );
    await Promise.all(
      segmentFiles?.map(async (segmentFile) => {
        const segmentPath = join(segmentsDir, segmentFile);
        const existsUploadSegment = existsSync(`${segmentPath}.uploaded`);
        if (!existsUploadSegment) {
          await this.uploadSegment(segmentPath);
          await fs.writeFile(`${segmentPath}.uploaded`, '');
        }
      })
    );
  }
}
