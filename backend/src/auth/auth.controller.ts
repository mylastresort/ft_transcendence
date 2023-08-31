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
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(public service: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoLogin() {}

  @Post('register')
  // @UseGuards(AuthGuard('token'))
  @ApiBearerAuth()
  async register(@Body() body: any) {
    return this.service.register(body.code);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async me(@Req() req: any) {
    return this.service.me(req.user.id);
  }

  @Post('Get2fa')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async twoFactorAuth(@Req() req: any, @Body() body: any) {
    return this.service.GettwoFactorAuth(req.user, body);
  }

  @Post('Verify2faTmp')
  @UseGuards(AuthGuard('tmpJwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async verifyTwoFactorAuthTmp(@Req() req: any, @Body() body: any) {
    return this.service.VerifytwoFactorAuth(req.user, body);
  }

  @Post('Verify2fa')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async verifyTwoFactorAuth(@Req() req: any, @Body() body: any) {
    return this.service.VerifytwoFactorAuth(req.user, body);
  }
}
