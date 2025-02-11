import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator';
import { EnumOrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class OrderDto {
  @IsOptional()
  @IsEnum(EnumOrderStatus, {
    message:
      'Order status must be one of: ' +
      Object.values(EnumOrderStatus).join(', ')
  })
  status: EnumOrderStatus;

  @IsArray({ message: 'Order does not have no one product' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class OrderItemDto {
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;

  @IsNumber({}, { message: 'Price must be a number' })
  price: number;

  @IsString({ message: 'Product id must be a string' })
  productId: string;

  @IsString({ message: 'Store id must be a string' })
  storeId: string;
}
