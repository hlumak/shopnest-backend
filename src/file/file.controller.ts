import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseInterceptors
} from '@nestjs/common';
import { FileService } from './file.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from '../auth/decorators/auth.decorator';
import { FastifyRequest } from 'fastify';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('files'))
  @Auth()
  @Post()
  async saveFiles(
    @Req() req: FastifyRequest,
    @Query('folder') folder?: string
  ) {
    const files = req.files();
    return this.fileService.saveFiles(files, folder);
  }
}
