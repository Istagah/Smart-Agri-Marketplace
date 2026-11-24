import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException({
        success: false,
        statusCode: 401,
        message: 'Invalid credentials.',
        errors: ['Email or password is incorrect.'],
        timestamp: new Date().toISOString(),
      });
    }

    const payload = {
      sub: user.userId,
      email: user.email,
      userType: user.userType,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
      },
    };
  }
}