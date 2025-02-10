import * as crypto from 'crypto';
import * as process from 'node:process';

export class LiqpayService {
  createCheckout(options) {
    const { action, amount, currency, description, orderId } = options;

    const jsonString = JSON.stringify({
      version: 3,
      public_key: process.env.PUBLIC_LIQPAY_KEY,
      action,
      amount,
      currency,
      description,
      order_id: orderId
    });

    const data = Buffer.from(jsonString).toString('base64');

    const signature = crypto
      .createHash('sha1')
      .update(
        process.env.PRIVATE_LIQPAY_KEY + data + process.env.PRIVATE_LIQPAY_KEY
      )
      .digest('base64');

    return { data, signature };
  }
}
