import { IsNumber, IsObject, IsString } from 'class-validator';

export class AuthDto {
  @IsNumber()
  id: number;

  @IsString()
  login: string;

  @IsString()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
}
