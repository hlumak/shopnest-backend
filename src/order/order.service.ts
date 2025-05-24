import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LiqPayService } from './service/liqPay.service';
import { OrderDto } from './dto/order.dto';
import { PaymentDto } from './dto/payment.dto';
import { Currency, PaymentAction } from './constants';
import { EnumOrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private liqPayService: LiqPayService
  ) {}

  async createPayment(dto: OrderDto, userId: string) {
    console.log('Creating payment with dto:', JSON.stringify(dto, null, 2));
    console.log('User ID:', userId);

    dto.items.forEach((item, index) => {
      console.log(
        `Item ${index}: price type = ${typeof item.price}, value = ${item.price}`
      );
    });

    const orderItems = dto.items.map(item => {
      const originalPrice = item.price;
      const numberPrice = Number(item.price);
      const roundedPrice = Math.round(numberPrice * 100) / 100;

      console.log(
        `Item processing: original=${originalPrice} (${typeof originalPrice}), number=${numberPrice}, rounded=${roundedPrice}`
      );

      return {
        quantity: item.quantity,
        price: roundedPrice,
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
      };
    });

    console.log('Final order items:', JSON.stringify(orderItems, null, 2));

    const total = orderItems.reduce((acc, item) => {
      const itemTotal = item.price * item.quantity;
      console.log(
        `Item total calculation: ${item.price} * ${item.quantity} = ${itemTotal}`
      );
      return acc + itemTotal;
    }, 0);
    const roundedTotal = Math.round(total * 100) / 100;

    console.log(`Total calculation: raw=${total}, rounded=${roundedTotal}`);

    const order = await this.prisma.order.create({
      data: {
        status: dto.status,
        items: {
          create: orderItems
        },
        total: roundedTotal,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });

    console.log('Order created with total:', order.total);
    console.log('Full order object:', JSON.stringify(order, null, 2));

    return this.liqPayService.createCheckout({
      action: PaymentAction.Pay,
      amount: roundedTotal,
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
