export class ObjectPayment {
  id: string;
  amount: number;
  currency: string;
  description: string;
  returnUrl: string;
  confirmationUrl: string;
}

export class PaymentStatusDto {
  event:
    | 'payment.succeeded'
    | 'payment.waiting_for_capture'
    | 'payment.canceled'
    | 'refund.succeeded';
  type: string;
  object: ObjectPayment;
}
