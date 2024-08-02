import { REST_CONTROLLERS_URL_NAMES } from '@/constants/rest-controllers';
import { REST_VERSIONS } from '@/constants/rest-versions';
import { TranscodeVideoDTO } from '@/dtos/videos/transcode-video.dto';
import { TranscodeVideoService } from '@/services/videos/transcode-video';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(REST_CONTROLLERS_URL_NAMES.VIDEOS.BASE)
@Controller({
  path: REST_CONTROLLERS_URL_NAMES.VIDEOS.TRANSCODE,
  version: REST_VERSIONS.V1
})
export class VideosTranscodeController {
  constructor(private readonly transcodeVideoService: TranscodeVideoService) {}

  @Post()
  async execute(@Body() data: TranscodeVideoDTO) {
    return {
      ok: await this.transcodeVideoService.execute(data)
    };
  }
}
