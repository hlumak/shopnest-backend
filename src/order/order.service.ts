import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LiqpayService } from './service/liqpay.service';
import { OrderDto } from './dto/order.dto';
import { EnumOrderStatus } from '@prisma/client';
import { PaymentDto } from './dto/payment.dto';
import { Currency, PaymentAction } from './constants';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private liqpayService: LiqpayService
  ) {}

  async createPayment(dto: OrderDto, userId: string) {
    const orderItems = dto.items.map(item => ({
      quantity: item.quantity,
      price: item.price,
      product: {
        connect: {
          id: item.productId
        }
      },
      store: {
        connect: {
          id: item.storeId
        }
      }
    }));

    const total = dto.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const order = await this.prisma.order.create({
      data: {
        status: dto.status,
        items: {
          create: orderItems
        },
        total,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });

    return this.liqpayService.createCheckout({
      action: PaymentAction.Pay,
      amount: total,
      currency: Currency.UAH,
      description: `Order payment in ShopNest. Payment id: #${order.id}`,
      orderId: order.id
    });
  }

  async updateStatus(paymentData: PaymentDto) {
    const { order_id, status } = paymentData;

    let orderStatus: EnumOrderStatus = EnumOrderStatus.PENDING;
    if (status === 'success') orderStatus = EnumOrderStatus.PAID;
    else if (status === 'failure' || status === 'error')
      orderStatus = EnumOrderStatus.FAILED;

    await this.prisma.order.update({
      where: { id: order_id },
      data: { status: orderStatus }
    });

    console.log(`Order ${order_id} updated to status: ${orderStatus}`);
  }
}
