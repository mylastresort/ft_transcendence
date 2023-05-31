import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
@Injectable()
export class TmpJwtStrategy extends PassportStrategy(Strategy, 'tmpJwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TMP_JWT_SECRET,
    });
  }
  async validate(payload) {
    return payload;
  }
}
