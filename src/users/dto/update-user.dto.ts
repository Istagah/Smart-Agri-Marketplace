import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { UserType } from '../user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/, {
    message: 'phoneNum must be a valid 11-digit mobile number.',
  })
  phoneNum?: string;

  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;
}