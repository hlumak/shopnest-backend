import { ArrayMinSize, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsString({ message: 'Title is required' })
  @IsNotEmpty({ message: 'Title can not be empty' })
  title: string;

  @IsString({ message: 'Description is required' })
  @IsNotEmpty({ message: 'Description can not be empty' })
  description: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price can not be empty' })
  price: number;

  @IsString({ message: 'Specify at least one picture', each: true })
  @ArrayMinSize(1, { message: 'Must be at least one picture' })
  images: string[];

  @IsString({ message: 'Category is required' })
  @IsNotEmpty({ message: 'Category id can not be empty' })
  categoryId: string;

  @IsString({ message: 'Color is required' })
  @IsNotEmpty({ message: 'Color id can not be empty' })
  colorId: string;
}
