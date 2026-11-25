import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  orderId: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsString()
  @IsNotEmpty()
  transactRef: string;
}