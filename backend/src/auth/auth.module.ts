import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  FortyTwoStrategy,
  JwtStrategy,
  TmpJwtStrategy,
  TokenStrategy,
} from './strategies';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.AUTH_JWT_SECRET,
        signOptions: { expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FortyTwoStrategy,
    TokenStrategy,
    JwtStrategy,
    TmpJwtStrategy,
  ],
})
export class AuthModule {}
