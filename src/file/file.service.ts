import { BadRequestException, Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import * as fs from 'fs-extra';
import { ensureDir, unlink, writeFile } from 'fs-extra';
import { FileResponse } from './file.interface';
import { MultipartFile } from '@fastify/multipart';

@Injectable()
export class FileService {
  async saveFiles(
    files: AsyncIterableIterator<MultipartFile>,
    folder: string = 'products'
  ) {
    const uploadedFolder = `${path}/uploads/${folder}`;
    await ensureDir(uploadedFolder);

    const response: FileResponse[] = [];
    for await (const file of files) {
      if (!file.filename.toLowerCase().endsWith('.webp')) {
        throw new BadRequestException('Only .webp files are allowed');
      }

      const buffer = await file.toBuffer();
      const originalName = `${Date.now()}-${file.filename}`;

      await writeFile(`${uploadedFolder}/${originalName}`, buffer);

      response.push({
        url: `/uploads/${folder}/${originalName}`,
        name: originalName
      });
    }

    return response;
  }

  async deleteFile(folder: string, filename: string) {
    const filePath = `${path}/uploads/${folder}/${filename}`;
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      throw new BadRequestException('File not found');
    }
    await unlink(filePath);
    return { message: 'File deleted successfully' };
  }
}
