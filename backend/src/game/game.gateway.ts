import {
  Catch,
  Inject,
  UseFilters,
  UsePipes,
  ValidationPipe,
  forwardRef,
} from '@nestjs/common';
import {
  BaseWsExceptionFilter,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { HttpGatewayExceptionFilter } from './game-exception.filter';
import { verify } from 'jsonwebtoken';
import { Server } from 'socket.io';
import { User } from '@prisma/client';

@Catch()
@UsePipes(new ValidationPipe())
@UseFilters(BaseWsExceptionFilter, HttpGatewayExceptionFilter)
@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() readonly wss: Server;

  @Inject(forwardRef(() => GameService)) private game: GameService;

  handleDisconnect(socket) {
    this.game.leave(socket);
  }

  async handleConnection(socket) {
    try {
      if (!socket.handshake.auth.token) throw new Error('No token');
      const user = verify(
        socket.handshake.auth.token,
        process.env.AUTH_JWT_SECRET,
      ) as User;
      if (!user) throw new Error('Invalid token');
      socket.data = await this.game.getPlayer(user.id);
<<<<<<< HEAD
=======
      socket.data.sid = socket.id;
>>>>>>> upstream/master
    } catch (err) {
      socket.emit('exception', err.error || err.message || err);
      socket.disconnect();
    }
<<<<<<< HEAD
=======
  }

  @SubscribeMessage('leave')
  handlePlayerLeave(socket) {
    return this.game.leave(socket);
>>>>>>> upstream/master
  }

  @SubscribeMessage('join')
  handlePlayerJoin(socket, body) {
    return this.game.join(socket, body);
  }

  @SubscribeMessage('ready')
  handlePlayerReady(socket, ready) {
    return this.game.ready(socket, ready);
  }

  @SubscribeMessage('pong')
  handlePlayerPong(socket, key) {
    return this.game.pong(socket, key);
  }

  @SubscribeMessage('move')
  handlePlayerMove(socket, crd) {
    return this.game.move(socket, crd);
  }
}
