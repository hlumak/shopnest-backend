import { IsString } from 'class-validator';

export class ColorDto {
  @IsString({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'Value is required' })
  value: string;
}
