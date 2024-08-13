import { PassThrough } from 'stream';

export const getStreamSize = async (stream: PassThrough): Promise<number> => {
  return new Promise((resolve, reject) => {
    let totalSize = 0;
    stream.on('data', (chunk) => {
      totalSize += chunk.length;
    });
    stream.on('end', () => {
      resolve(totalSize);
    });
    stream.on('error', () => {
      reject(0);
    });
  });
};
