import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('v1/auth')

export class AuthController {
  

  @UseGuards(AuthGuard('42'))
  @Post('signin/42')
  async signIn() {
    return { message: 'success'}
  }

  @UseGuards(AuthGuard('42'))
  @Get('callback/42')
  @HttpCode(HttpStatus.OK)
  async callback(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('42'))
  @Get('me')
  async profile(@Req() req) {
    return req.user?.pofile;
  }
}
