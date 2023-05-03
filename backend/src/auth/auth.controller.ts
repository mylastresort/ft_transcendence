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

@Controller({
  path: 'auth',
  // version: '1',
})
export class AuthController {
  @UseGuards(AuthGuard('42'))
  @Post('signin/42')
  async signIn() {
    return;
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
