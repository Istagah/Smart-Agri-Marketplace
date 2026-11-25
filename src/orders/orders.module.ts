import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from '../order-items/order-item.entity';
import { Product } from '../products/product.entity';
import { Order } from './order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [TypeOrmModule, OrdersService],
})
export class OrdersModule {}