import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class updateProfileImg {
  @IsNotEmpty()
  @IsString()
  imgProfile: string;
}

export class updateProfile {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsString()
  location: string;

  @IsString()
  summary: string;
}
