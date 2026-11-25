import { IsEnum } from 'class-validator';
import { OrderStatus } from '../order.entity';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message:
      'Status must be one of: Pending, Paid, Shipped, Delivered, Cancelled.',
  })
  status: OrderStatus;
}