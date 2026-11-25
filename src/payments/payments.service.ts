import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../orders/order.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { Payment, PaymentStatus } from './payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const order = await this.ordersRepository.findOne({
      where: { orderId: createPaymentDto.orderId },
    });

    if (!order) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'Order not found.',
        errors: [`No order exists with ID ${createPaymentDto.orderId}.`],
        timestamp: new Date().toISOString(),
      });
    }

    const existingPayment = await this.paymentsRepository.findOne({
      where: { orderId: createPaymentDto.orderId },
    });

    if (existingPayment) {
      throw new ConflictException({
        success: false,
        statusCode: 409,
        message: 'Payment already processed.',
        errors: [
          `Order ID ${createPaymentDto.orderId} has already been paid.`,
        ],
        timestamp: new Date().toISOString(),
      });
    }

    const payment = this.paymentsRepository.create({
      ...createPaymentDto,
      paymentStatus: PaymentStatus.COMPLETED,
    });

    const savedPayment = await this.paymentsRepository.save(payment);

    order.status = OrderStatus.PAID;
    await this.ordersRepository.save(order);

    return savedPayment;
  }

  async findOne(paymentId: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { paymentId },
    });

    if (!payment) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'Payment not found.',
        errors: [`No payment exists with ID ${paymentId}.`],
        timestamp: new Date().toISOString(),
      });
    }

    return payment;
  }

  async updateStatus(
    paymentId: number,
    dto: UpdatePaymentStatusDto,
  ): Promise<Payment> {
    const payment = await this.findOne(paymentId);
    payment.paymentStatus = dto.paymentStatus;
    return this.paymentsRepository.save(payment);
  }
}