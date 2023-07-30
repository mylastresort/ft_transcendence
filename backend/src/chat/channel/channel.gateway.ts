import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/ws-jwt/ws-jwt.guard';
import { SocketAuthMiddleware } from 'src/auth/ws.middleware';

interface Message{
  room: string;
  msg: string;
}
@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: 'http://localhost:3000',
  },
})

@UseGuards(WsJwtGuard)
export default class ChannelGateway {
  @WebSocketServer()
  server: Server;

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
    client.on('connection', (socket) => {
      console.log('channel member connected: ', socket.id);
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join-room')
  joinRoom(@MessageBody() room: any, @ConnectedSocket() client: Socket): void {
    console.log('joinRoom: ', room);
    console.log(client.data);
    // client.to(room)
    client.join(room);
  }

  @SubscribeMessage('sendMsg')
  SendMessage(@MessageBody() data: any): void {
    console.log('sendMsg: ', data);
    this.server.to(data.room).emit('newMsg', data.msg);
  }
}
