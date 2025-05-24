import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileCleanupService } from './file-cleanup.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { FastifyReply, FastifyRequest } from 'fastify';
import { path } from 'app-root-path';
import * as fs from 'fs-extra';

@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly fileCleanupService: FileCleanupService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Auth()
  @Post()
  async saveFiles(
    @Req() req: FastifyRequest,
    @Query('folder') folder?: string
  ) {
    const files = req.files();
    return this.fileService.saveFiles(files, folder);
  }

  @Get('uploads/:folder/:filename')
  async serveFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() reply: FastifyReply
  ) {
    const filePath = `${path}/uploads/${folder}/${filename}`;
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      return reply.code(404).send({ message: 'File not found' });
    }

    const stream = fs.createReadStream(filePath);
    return reply.type('image/webp').send(stream);
  }

  @Auth()
  @Delete('uploads/:folder/:filename')
  async deleteFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string
  ) {
    return this.fileService.deleteFile(folder, filename);
  }

  @Auth()
  @Post('cleanup')
  async manualCleanup() {
    await this.fileCleanupService.manualCleanup();
    return { message: 'Manual cleanup completed' };
  }

  @Auth()
  @Get('cleanup/stats')
  async getCleanupStats() {
    return this.fileCleanupService.getCleanupStats();
  }
}
