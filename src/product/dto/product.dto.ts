import { Decimal } from '@prisma/client/runtime/library';
import {
  ArrayMinSize,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

export class ProductDto {
  @IsString({ message: 'Title is required' })
  @IsNotEmpty({ message: 'Title can not be empty' })
  title: string;

  @IsString({ message: 'Description is required' })
  @IsNotEmpty({ message: 'Description can not be empty' })
  description: string;

  @IsDecimal({}, { message: 'Price must be a decimal number' })
  @IsNotEmpty({ message: 'Price can not be empty' })
  price: Decimal;

  @IsString({ message: 'Specify at least one picture', each: true })
  @ArrayMinSize(1, { message: 'Must be at least one picture' })
  images: string[];

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  categoryId?: string;

  @IsOptional()
  @IsString({ message: 'Color must be a string' })
  colorId?: string;
}
