import {
  Body,
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
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('/v1/auth')
export class AuthController {
  constructor(public service: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLogin() {}

  @Post('register')
  @UseGuards(AuthGuard('token'))
  @ApiBearerAuth()
  async register(@Req() req: any) {
    return this.service.register(req.user);
  }

  @Get('me')
  @UseGuards(AuthGuard('token'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async me(@Req() req: any) {
    return req.user;
  }

  @Post('Get2fa')
  @UseGuards(AuthGuard('token'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async twoFactorAuth(@Req() req: any, @Body() body: any) {
    return this.service.GettwoFactorAuth(req.user, body);
  }
}
