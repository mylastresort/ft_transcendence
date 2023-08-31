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
import { PrivateChatService } from './privateChat.service';

@WebSocketGateway({
  namespace: 'ws/chat',
  cors: {
    origin: process.env.FRONTEND_DOMAIN,
  },
})
@UseGuards(WsJwtGuard)
export class PrivateChatGatway {
  constructor(private privateChatService: PrivateChatService) {}
  @WebSocketServer()
  server: Server;

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('private/join-room')
  joinPrivateRoom(
    @MessageBody() room: any,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('joinPrivateRoom: ', room);
    client.join(room);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('private/leave-room')
  leavePrivateRoom(
    @MessageBody() room: any,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('leavePrivateRoom: ', room);
    client.leave(room);
  }

  @SubscribeMessage('private/sendMsg')
  async SendPrivateMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('SendPrivateMessage: ', data);
    const createdMessage = await this.privateChatService.createMessage(
      client.data,
      data,
    );
    this.server.to(data.id).emit('private/newMsg', createdMessage);
  }
}
