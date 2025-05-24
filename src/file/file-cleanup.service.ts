import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';
import { path } from 'app-root-path';
import * as fs from 'fs-extra';
import * as pathModule from 'path';

@Injectable()
export class FileCleanupService {
  private readonly logger = new Logger(FileCleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupUnusedImages() {
    this.logger.log('Starting cleanup of unused product images...');

    try {
      const uploadsPath = `${path}/uploads/products`;

      if (!(await fs.pathExists(uploadsPath))) {
        this.logger.warn('Products upload folder does not exist');
        return;
      }

      const files = await fs.readdir(uploadsPath);
      this.logger.log(`Found ${files.length} files in products folder`);

      const products = await this.prisma.product.findMany({
        select: {
          images: true
        }
      });

      const usedImages = new Set<string>();

      products.forEach(product => {
        product.images.forEach(imageUrl => {
          const filename = pathModule.basename(imageUrl);
          usedImages.add(filename);
        });
      });

      this.logger.log(`Found ${usedImages.size} images in use`);

      const unusedFiles = files.filter(file => !usedImages.has(file));

      if (unusedFiles.length === 0) {
        this.logger.log('No unused images found');
        return;
      }

      this.logger.log(`Found ${unusedFiles.length} unused images to delete`);

      let deletedCount = 0;
      for (const file of unusedFiles) {
        try {
          const filePath = pathModule.join(uploadsPath, file);
          await fs.unlink(filePath);
          deletedCount++;
          this.logger.debug(`Deleted unused image: ${file}`);
        } catch (error) {
          this.logger.error(`Failed to delete file ${file}:`, error);
        }
      }

      this.logger.log(`Successfully deleted ${deletedCount} unused images`);
    } catch (error) {
      this.logger.error('Error during image cleanup:', error);
    }
  }

  async manualCleanup() {
    this.logger.log('Manual cleanup triggered');
    await this.cleanupUnusedImages();
  }

  async getCleanupStats() {
    try {
      const uploadsPath = `${path}/uploads/products`;

      if (!(await fs.pathExists(uploadsPath))) {
        return {
          totalFiles: 0,
          usedFiles: 0,
          unusedFiles: 0
        };
      }

      const files = await fs.readdir(uploadsPath);
      const products = await this.prisma.product.findMany({
        select: {
          images: true
        }
      });

      const usedImages = new Set<string>();
      products.forEach(product => {
        product.images.forEach(imageUrl => {
          const filename = pathModule.basename(imageUrl);
          usedImages.add(filename);
        });
      });

      const unusedFiles = files.filter(file => !usedImages.has(file));

      return {
        totalFiles: files.length,
        usedFiles: usedImages.size,
        unusedFiles: unusedFiles.length,
        unusedFilesList: unusedFiles
      };
    } catch (error) {
      this.logger.error('Error getting cleanup stats:', error);
      throw error;
    }
  }
}
