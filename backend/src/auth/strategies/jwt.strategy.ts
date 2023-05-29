import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import fetch from 'node-fetch';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'token') {
  async authenticate(req: any, options?: any): Promise<any> {
    const { authorization } = req.headers;
    if (!authorization) {
      console.log(req.headers);
      return this.fail('Unauthorized');
    }
    const token = authorization.split(' ')[1];
    try {
      const response = await fetch('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const user = await response.json();
        this.success(user);
      } else {
        this.fail('Unauthorized');
      }
    } catch (error) {
      this.error(error);
    }
  }
}
