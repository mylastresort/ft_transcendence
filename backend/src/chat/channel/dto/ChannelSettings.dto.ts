import {
  IsString,
  MinLength,
  MaxLength,
  ValidateIf,
  IsIn,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class PasswordDto {
  @IsNumber()
  id: number;

  @IsIn(['c', 'r', 's'], { message: 'Invalid mode' })
  mode: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @ValidateIf((obj, value) => obj.mode !== 'r')
  pass: string;
}

export class MembersDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  channelName: string;

  @IsBoolean()
  isKick: boolean;
  @IsBoolean()
  isMute: boolean;
  @IsBoolean()
  isBan: boolean;

  @IsNumber()
  time: number;
}

export class AdminDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
