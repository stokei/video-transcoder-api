import { Test, TestingModule } from '@nestjs/testing';
import { VideosTranscodeController } from '.';
import { TranscodeVideoService } from '@/services/videos/transcode-video';

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
        file: '',
        url: ''
      })
    ).toBe({
      ok: true
    });
  });
});
