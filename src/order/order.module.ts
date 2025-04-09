import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../prisma.service';
import { LiqPayService } from './service/liqPay.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, LiqPayService]
})
export class OrderModule {}
