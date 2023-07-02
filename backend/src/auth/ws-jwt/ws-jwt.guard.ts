import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }
    const client = context.switchToWs().getClient();

    WsJwtGuard.validateToken(client);

    return true;
  }

  static validateToken(client: Socket) {
    const { authorization } = client.handshake.headers;
    if (!authorization) {
      throw new Error('No authorization header');
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }
    const payload = verify(token, process.env.AUTH_JWT_SECRET);

    return payload;
  }
}
