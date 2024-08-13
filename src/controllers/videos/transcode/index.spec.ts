import { Test, TestingModule } from '@nestjs/testing';

import { TranscodeVideoService } from '@/services/videos/transcode-video';

import { VideosTranscodeController } from '.';

describe('VideosTranscodeController', () => {
  let videosTranscodeController: VideosTranscodeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [VideosTranscodeController],
      providers: [TranscodeVideoService]
    }).compile();

    videosTranscodeController = app.get<VideosTranscodeController>(
      VideosTranscodeController
    );
  });

  it('should return successfully when video is sended', () => {
    expect(
      videosTranscodeController.execute({
        fileId: 'file1',
        source: 'https://storage.com/file-sorce',
        notificationUrl: 'https://google.com'
      })
    ).toBe({
      ok: true
    });
  });

  it('should return error when one data is empty', () => {
    expect(
      videosTranscodeController.execute({
        fileId: '',
        source: 'https://storage.com/file-sorce',
        notificationUrl: 'https://google.com'
      })
    ).toBe({
      ok: false
    });
  });
});
