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
import { Server, Socket } from 'socket.io';
import { User } from '@prisma/client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { _Player } from './_player.class';

export type Player = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  _Player
>;

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

  handleDisconnect(socket: Player) {
    this.game.leave(socket);
  }

  async handleConnection(socket: Player) {
    try {
      if (!socket.handshake.auth.token) throw new Error('No token');
      const user = verify(
        socket.handshake.auth.token,
        process.env.AUTH_JWT_SECRET,
      ) as User;
      if (!user) throw new Error('Invalid token');
      socket.data = await this.game.getPlayer(user.id);
      socket.data.currentUserSocketId = socket.id;
      this.game.addPlayerSocket(socket);
    } catch (err) {
      console.error(err);
      socket.emit('exception', err.error || err.message || err);
    }
  }

  @SubscribeMessage('leave')
  handlePlayerLeave(socket: Player) {
    return this.game.leave(socket);
  }

  @SubscribeMessage('join')
  handlePlayerJoin(socket: Player, body) {
    return this.game.join(socket, body);
  }

  @SubscribeMessage('invite')
  handlePlayerInvite(socket: Player, body) {
    return this.game.invite(socket, body);
  }

  @SubscribeMessage('ready')
  handlePlayerReady(socket: Player, { ready, gameId }) {
    return this.game.ready(socket, ready, gameId);
  }

  @SubscribeMessage('pong')
  handlePlayerPong(socket: Player, key) {
    return this.game.pong(socket, key);
  }

  @SubscribeMessage('move')
  handlePlayerMove(socket: Player, crd) {
    return this.game.move(socket, crd);
  }

  @SubscribeMessage('chat')
  handlePlayerChat(socket: Player, msg) {
    return this.game.chat(socket, msg);
  }

  @SubscribeMessage('watch-user-status')
  handleWatchUserStatus(socket: Player, userId) {
    return this.game.watchUserStatus(socket, userId);
  }

  @SubscribeMessage('unwatch-user-status')
  handleUnwatchUserStatus(socket: Player, userId) {
    return this.game.unwatchUserStatus(socket, userId);
  }
}
