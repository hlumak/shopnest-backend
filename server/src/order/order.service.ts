import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LiqpayService } from './service/liqpay.service';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private liqpayService: LiqpayService
  ) {}

  createPayment(dto: OrderDto, userId: string) {
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

    const order = this.prisma.order.create({
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
      action: 'pay',
      amount: total,
      currency: 'UAH',
      description: `Order payment in ShopNest. Payment id: #${order.id}`,
      orderId: order.id
    });
  }
}
