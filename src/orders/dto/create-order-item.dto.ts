import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  productId: number;

  @IsInt()
  @IsPositive({ message: 'Quantity must be greater than 0.' })
  quantity: number;
}