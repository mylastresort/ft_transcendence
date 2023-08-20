import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  ValidateIf,
  IsIn,
} from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  channelName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @ValidateIf((obj, value) => obj.chMode === 'protected')
  password: string;

  @IsString()
  @MinLength(30)
  @MaxLength(150)
  description: string;

  @IsIn(['public', 'private', 'protected'], { message: 'Invalid controlValue' })
  chMode: string;
}
