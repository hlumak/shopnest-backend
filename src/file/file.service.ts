import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
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
}
