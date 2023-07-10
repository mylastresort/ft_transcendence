import { Catch, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  BaseWsExceptionFilter,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { HttpGatewayExceptionFilter } from './game-exception.filter';
import { verify } from 'jsonwebtoken';
import { Server } from 'socket.io';
import { User } from '@prisma/client';

@Catch()
@UsePipes(new ValidationPipe())
@UseFilters(BaseWsExceptionFilter, HttpGatewayExceptionFilter)
@WebSocketGateway(99, {
  cors: {
    allowedHeaders: 'Authorization',
    credentials: true,
    origin: 'http://localhost:3000',
  },
  allowRequest: ({ headers: { authorization } }, cb) => {
    try {
      if (!authorization) throw new WsException('Missing authorization header');
      verify(authorization.split(' ')[1], process.env.AUTH_JWT_SECRET);
      cb(null, true);
    } catch (err) {
      cb(err, false);
    }
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() readonly wss: Server;

  constructor(private readonly game: GameService) {}

  handleDisconnect(socket) {
    this.game.leave(socket);
  }

  async handleConnection(socket) {
    const { id } = verify(
      socket.handshake.headers.authorization.split(' ')[1],
      process.env.AUTH_JWT_SECRET,
    ) as User;
    socket.data = await this.game.getPlayer(id);
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
