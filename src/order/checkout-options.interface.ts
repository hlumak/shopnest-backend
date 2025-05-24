import { Decimal } from '@prisma/client/runtime/library';
import { Currency, PaymentAction } from './constants';

export interface CheckoutOptions {
  action: PaymentAction;
  amount: Decimal;
  currency: Currency;
  description: string;
  orderId: string;
}
