import { Decimal } from '@prisma/client/runtime/library';

export class CheckoutDto {
  amount: Decimal;
  currency: string;
  description: string;
  resultUrl: string;
  paymentUrl: string;
}
