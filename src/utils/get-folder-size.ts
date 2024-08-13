import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export const getFolderSize = async (directory: string): Promise<number> => {
  const files = await readdir(directory, { withFileTypes: true });

  const sizePromises = files.map(async (file) => {
    const filePath = join(directory, file.name);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      return getFolderSize(filePath);
    } else {
      return stats.size;
    }
  });

  const sizes = await Promise.all(sizePromises);
  const totalSize = sizes
    ?.filter(Boolean)
    ?.reduce((acc, size) => acc + size, 0);

  return totalSize;
};
