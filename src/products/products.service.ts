import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll(category?: string, page = 1, limit = 10) {
    if (page < 1 || Number.isNaN(page)) {
      throw new BadRequestException({
        success: false,
        statusCode: 400,
        message: 'Invalid query parameter.',
        errors: ['page parameter must be a positive integer.'],
        timestamp: new Date().toISOString(),
      });
    }

    const where = category ? { category } : {};
    const [data, total] = await this.productsRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    return { page, limit, total, data };
  }

  async findOne(productId: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { productId },
    });

    if (!product) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'Product not found.',
        errors: [`No product exists with ID ${productId}.`],
        timestamp: new Date().toISOString(),
      });
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async replace(
    productId: number,
    updateProductDto: CreateProductDto,
  ): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { productId },
    });

    if (!product) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'Product not found.',
        errors: [`Cannot replace non-existent product ID ${productId}.`],
        timestamp: new Date().toISOString(),
      });
    }

    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(productId: number): Promise<void> {
    const result = await this.productsRepository.delete(productId);
    if (result.affected === 0) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'Product not found.',
        errors: [`No product exists with ID ${productId}.`],
        timestamp: new Date().toISOString(),
      });
    }
  }
}