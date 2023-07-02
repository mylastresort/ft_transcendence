import { Socket } from 'socket.io';
import { WsJwtGuard } from './ws-jwt/ws-jwt.guard';

export type WsMiddleware = {
  (client: Socket, next: (err?: Error) => void): void;
};

export const SocketAuthMiddleware = (): WsMiddleware => {
  return (client: Socket, next: (err?: Error) => void) => {
    try {
      const payload = WsJwtGuard.validateToken(client);
      client.data = payload;
      next();
    } catch (err) {
      next(err);
    }
  };
};
