import { join } from 'path';

const BASE_PATH = 'videos';

export class FilePathMapper {
  constructor(private readonly fileId: string) {}

  get source() {
    return join(BASE_PATH, `${this?.fileId}/source`);
  }
  get output() {
    return join(BASE_PATH, `${this?.fileId}/stream`);
  }
  get playlist() {
    return join(`${this.output}/output.m3u8`);
  }
  mountSegmentName() {
    return join(`${this.output}/segment%03d.ts`);
  }
}
