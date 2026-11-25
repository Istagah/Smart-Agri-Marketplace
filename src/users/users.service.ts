import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException({
        success: false,
        statusCode: 409,
        message: 'Email address already registered.',
        errors: [`The email ${createUserDto.email} is already in use.`],
        timestamp: new Date().toISOString(),
      });
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }

  async findAll(page = 1, limit = 10) {
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        userId: true,
        fullName: true,
        email: true,
        phoneNum: true,
        userType: true,
      },
    });

    return { page, limit, total, data: users };
  }

  async findById(userId: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({
      where: { userId },
      select: {
        userId: true,
        fullName: true,
        email: true,
        phoneNum: true,
        userType: true,
      },
    });

    if (!user) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'User not found.',
        errors: [`No user exists with ID ${userId}.`],
        timestamp: new Date().toISOString(),
      });
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'User not found.',
        errors: [`No user exists with ID ${userId}.`],
        timestamp: new Date().toISOString(),
      });
    }

    Object.assign(user, updateUserDto);
    const updated = await this.usersRepository.save(user);
    const { password, ...result } = updated;
    return result;
  }

  async remove(userId: number): Promise<void> {
    const result = await this.usersRepository.delete(userId);
    if (result.affected === 0) {
      throw new NotFoundException({
        success: false,
        statusCode: 404,
        message: 'User not found.',
        errors: [`No user exists with ID ${userId}.`],
        timestamp: new Date().toISOString(),
      });
    }
  }
}