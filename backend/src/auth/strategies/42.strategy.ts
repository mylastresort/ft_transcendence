import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/v1/auth/42/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, login, email } = profile._json;
    return { id, login, email };
  }
}
