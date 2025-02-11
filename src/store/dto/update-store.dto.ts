import { IsString } from 'class-validator';
import { CreateStoreDto } from './create-store.dto';

export class UpdateStoreDto extends CreateStoreDto {
  @IsString({ message: 'Description is required!' })
  description: string;
}
