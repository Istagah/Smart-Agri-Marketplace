import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../order-items/order-item.entity';
import { Product } from '../products/product.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order, OrderStatus } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll(status?: OrderStatus) {
    const where = status ? { status } : {};
    const data = await this.ordersRepository.find({ where });
    return { total: data.length, data };
  }

  async findOne(orderId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { orderId } });
    if (!order) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'Order not found.',
        errors: [`No order exists with ID ${orderId}.`],
        timestamp: new Date().toISOString(),
      });
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create(createOrderDto);
    return this.ordersRepository.save(order);
  }

  async updateStatus(
    orderId: number,
    updateStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.findOne(orderId);
    order.status = updateStatusDto.status;
    return this.ordersRepository.save(order);
  }

  async remove(orderId: number): Promise<void> {
    const result = await this.ordersRepository.delete(orderId);
    if (result.affected === 0) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'Order not found.',
        errors: [`No order exists with ID ${orderId}.`],
        timestamp: new Date().toISOString(),
      });
    }
  }

  async findItems(orderId: number) {
    await this.findOne(orderId);
    const items = await this.orderItemsRepository.find({
      where: { orderId },
    });
    return { orderId, items };
  }

  async addItem(orderId: number, dto: CreateOrderItemDto): Promise<OrderItem> {
    const order = await this.findOne(orderId);
    const product = await this.productsRepository.findOne({
      where: { productId: dto.productId },
    });

    if (!product) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'Product not found.',
        errors: [`No product exists with ID ${dto.productId}.`],
        timestamp: new Date().toISOString(),
      });
    }

    const subtotal = Number(product.price) * dto.quantity;
    const item = this.orderItemsRepository.create({
      orderId,
      productId: dto.productId,
      quantity: dto.quantity,
      subtotal,
    });

    const savedItem = await this.orderItemsRepository.save(item);

    order.total = Number(order.total) + subtotal;
    await this.ordersRepository.save(order);

    return savedItem;
  }
}