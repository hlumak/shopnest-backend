import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { OrderDto } from './dto/order.dto';
import { CurrentUser } from '../user/decorators/user.decorator';
import * as crypto from 'crypto';
import { RequestOrderStatusDto } from './dto/request-order-status.dto';
import { PaymentDto } from './dto/payment.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @Auth()
  @Post('place')
  async checkout(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
    return this.orderService.createPayment(dto, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('status')
  async updateStatus(@Body() body: RequestOrderStatusDto) {
    const { data, signature } = body;

    const expectedSignature = crypto
      .createHash('sha1')
      .update(
        process.env.PRIVATE_LIQPAY_KEY + data + process.env.PRIVATE_LIQPAY_KEY
      )
      .digest('base64');

    if (signature !== expectedSignature) {
      return { status: 'error', message: 'Invalid signature' };
    }

    const decodedData = JSON.parse(
      Buffer.from(data, 'base64').toString()
    ) as PaymentDto;

    await this.orderService.updateStatus(decodedData);

    return { status: 'success' };
  }
}
