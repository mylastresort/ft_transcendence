import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { config } from 'dotenv';

config();

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      callbackURL: '/api/auth/callback/42',
    });
  }

  validate(accessToken, refreshToken, profile, cb) {
    cb(null, { accessToken, refreshToken, profile });
    return { accessToken, refreshToken, profile };
  }
}
