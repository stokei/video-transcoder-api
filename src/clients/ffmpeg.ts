import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as fluentFfmpeg from 'fluent-ffmpeg';
fluentFfmpeg.setFfmpegPath(ffmpegInstaller.path);
export const ffmpeg = fluentFfmpeg;
