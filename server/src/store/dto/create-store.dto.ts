import { IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString({ message: 'Title is required!' })
  title: string;
}
