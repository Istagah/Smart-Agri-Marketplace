import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../products/product.entity';
import { Order } from '../orders/order.entity';

export enum UserType {
  FARMER = 'Farmer',
  BUYER = 'Buyer',
  ADMIN = 'Admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  fullName: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  phoneNum: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.BUYER })
  userType: UserType;

  // 1 Farmer -> Many Products
  @OneToMany(() => Product, (product) => product.farmer)
  products: Product[];

  // 1 Buyer -> Many Orders
  @OneToMany(() => Order, (order) => order.buyer)
  orders: Order[];
}