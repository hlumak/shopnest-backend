import * as crypto from 'crypto';
import * as process from 'node:process';

export class LiqpayService {
  createCheckout(options) {
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
      server_url: `https://7bfb-91-196-120-10.ngrok-free.app/orders/status`
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
      desription: checkout.description,
      return_url: checkout.result_url,
      confirmation_url: `https://www.liqpay.ua/api/3/checkout?data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}`
    };
  }
}
