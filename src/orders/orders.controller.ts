import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserType } from '../users/user.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './order.entity';
import { OrdersService } from './orders.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query('status') status?: OrderStatus) {
    return this.ordersService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserType.BUYER)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserType.FARMER, UserType.ADMIN)
  @Patch(':id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateStatusDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserType.BUYER, UserType.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }

  @Get(':id/items')
  findItems(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findItems(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserType.BUYER)
  @Post(':id/items')
  @HttpCode(HttpStatus.CREATED)
  addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ) {
    return this.ordersService.addItem(id, createOrderItemDto);
  }
}