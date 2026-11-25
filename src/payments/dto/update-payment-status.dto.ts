import { IsEnum } from 'class-validator';
import { PaymentStatus } from '../payment.entity';

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;
}