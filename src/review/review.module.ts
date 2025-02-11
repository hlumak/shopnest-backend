import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from '../prisma.service';
import { ProductService } from '../product/product.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService, ProductService]
})
export class ReviewModule {}
