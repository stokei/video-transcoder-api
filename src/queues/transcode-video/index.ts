import { Processor, WorkerHost } from '@nestjs/bullmq';
import axios from 'axios';
import { Job } from 'bullmq';
import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import { join } from 'path';
import { PassThrough } from 'stream';

import { ffmpeg } from '@/clients/ffmpeg';
import { TranscodeVideoDTO } from '@/dtos/videos/transcode-video.dto';
import { VideoStatus } from '@/enums/video-status.enum';
import { FilePathMapper } from '@/mappers/file-path';
import { UploadFileService } from '@/services/uploads/upload-file';
import { NotifyVideoStatusService } from '@/services/videos/notify-video-status';
import { convertDurationFromStringToSeconds } from '@/utils/convert-duration-from-string-to-seconds';
import { getFolderSize } from '@/utils/get-folder-size';
import { getStreamSize } from '@/utils/get-stream-size';

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
    const baseNotifyVideoData = {
      fileId: data?.fileId,
      notificationUrl: data?.notificationUrl,
      mimetype: 'video/mp4',
      extension: 'm3u8'
    };
    await this.notifyVideoStatusService.execute({
      ...baseNotifyVideoData,
      status: VideoStatus.ENCODING,
      duration: 0,
      size: 0
    });
    try {
      const transcoded = await this.downloadAndTranscodeVideo(data);
      if (transcoded) {
        await this.notifyVideoStatusService.execute({
          ...baseNotifyVideoData,
          status: VideoStatus.COMPLETED,
          ...transcoded
        });
      } else {
        await this.notifyVideoStatusService.execute({
          ...baseNotifyVideoData,
          status: VideoStatus.FAILED,
          errorMessage: `Error transcoding video for job -> ${job.id}`,
          ...transcoded
        });
      }
    } catch (error) {
      await this.notifyVideoStatusService.execute({
        ...baseNotifyVideoData,
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
    mimetype: string;
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

        const originalFileStream = new PassThrough();
        const originalFileRequest = await axios({
          method: 'get',
          url: source,
          responseType: 'stream'
        });
        originalFileRequest.data.pipe(originalFileStream);
        let durationString: string;
        ffmpeg()
          .input(originalFileStream)
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
          .on('progress', (progress) => {
            durationString = progress.timemark;
          })
          .on('end', async () => {
            const outputFileSize = await getFolderSize(
              join(process.cwd(), filePathMapper.output)
            );
            const originalFileSize = parseFloat(
              originalFileRequest.headers?.['content-length']
            );
            const duration = convertDurationFromStringToSeconds(durationString);
            const uploadedPlaylist = await this.uploadPlaylistAndRemoveOldFiles(
              {
                fileId
              }
            );
            if (uploadedPlaylist) {
              return resolve({
                mimetype: originalFileRequest.headers?.['content-type'],
                duration,
                size: outputFileSize + originalFileSize
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
      isPublic: true,
      contentType: 'video/MP2T'
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
