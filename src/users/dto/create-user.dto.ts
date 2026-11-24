import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserType } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;

  @IsString()
  @Matches(/^\d{11}$/, {
    message: 'phoneNum must be a valid 11-digit mobile number.',
  })
  phoneNum: string;

  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;
}