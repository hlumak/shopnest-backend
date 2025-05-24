import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileCleanupService } from './file-cleanup.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [FileService, FileCleanupService, PrismaService]
})
export class FileModule {}
