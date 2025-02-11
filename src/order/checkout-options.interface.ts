import { Currency, PaymentAction } from './constants';

export interface CheckoutOptions {
  action: PaymentAction;
  amount: number;
  currency: Currency;
  description: string;
  orderId: string;
}
