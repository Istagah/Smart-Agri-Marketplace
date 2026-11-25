import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  farmerId: number;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsPositive({ message: 'Price must be greater than 0.' })
  price: number;
}