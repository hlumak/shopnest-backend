import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { OrderDto } from './dto/order.dto';
import { CurrentUser } from '../user/decorators/user.decorator';
import * as crypto from 'crypto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post('place')
  async checkout(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
    return this.orderService.createPayment(dto, userId);
  }

  @HttpCode(200)
  @Post('status')
  async updateStatus(@Body() body: any) {
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

    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString());

    await this.orderService.updateStatus(decodedData);

    return { status: 'success' };
  }
}
