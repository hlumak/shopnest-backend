import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class AuthDto {
  @IsOptional()
  @MinLength(2, { message: 'Name must contain more than 2 characters!' })
  @MaxLength(35, { message: 'Name must contain less than 35 characters!' })
  @IsString()
  name: string;

  @IsString({ message: 'Email is required' })
  @MaxLength(50, { message: 'Email must contain less than 50 characters!' })
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must contain more than 6 characters!' })
  @MaxLength(20, { message: 'Password must contain less than 20 characters!' })
  @IsString({ message: 'Password is required' })
  password: string;
}
