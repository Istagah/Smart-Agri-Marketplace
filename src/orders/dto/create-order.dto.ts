import { IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  buyerId: number;

  @IsNumber()
  @Min(0, { message: 'Total amount must be greater than or equal to 0.' })
  total: number;
}