import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LiqPayService } from './service/liqPay.service';
import { OrderDto } from './dto/order.dto';
import { PaymentDto } from './dto/payment.dto';
import { Currency, PaymentAction } from './constants';
import { EnumOrderStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private liqPayService: LiqPayService
  ) {}

  async createPayment(dto: OrderDto, userId: string) {
    const orderItems = dto.items.map(item => ({
      quantity: item.quantity,
      price: new Decimal(item.price),
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
      const price = new Decimal(item.price);
      const quantity = new Decimal(item.quantity);
      return acc.plus(price.mul(quantity));
    }, new Decimal(0));

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

    return this.liqPayService.createCheckout({
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
  }
}
