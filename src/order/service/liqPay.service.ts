import * as crypto from 'crypto';
import { CheckoutDto } from '../dto/checkout.dto';
import { CheckoutOptions } from '../checkout-options.interface';

export class LiqPayService {
  createCheckout(options: CheckoutOptions): CheckoutDto {
    const { action, amount, currency, description, orderId } = options;

    const checkout = {
      version: 3,
      public_key: process.env.PUBLIC_LIQPAY_KEY,
      action,
      amount,
      currency,
      description,
      order_id: orderId,
      result_url: `${process.env.CLIENT_URL}/thanks`,
      server_url: `${process.env.SERVER_URL}/orders/status`
    };

    const jsonString = JSON.stringify(checkout);

    const data = Buffer.from(jsonString).toString('base64');

    const signature = crypto
      .createHash('sha1')
      .update(
        process.env.PRIVATE_LIQPAY_KEY + data + process.env.PRIVATE_LIQPAY_KEY
      )
      .digest('base64');

    return {
      amount: checkout.amount,
      currency: checkout.currency,
      description: checkout.description,
      resultUrl: checkout.result_url,
      paymentUrl: `https://www.liqpay.ua/api/3/checkout?data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}`
    };
  }
}
