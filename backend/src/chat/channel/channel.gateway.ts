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
import { ChannelService } from './channel.service';
interface Message {
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
  constructor(private channelService: ChannelService) {}
  @WebSocketServer()
  server: Server;

  updateChannel(members) {
    console.log('updated: ', members);
    members.forEach((member) => {
      this.server
        .to(member.user.ChatSocketId)
        .emit('updateChannel', member.nickname);
    });
  }

  notifyMember(member, reason) {
    console.log('kick', member);
    reason.isKick || reason.isBan
      ? this.server.to(member.user.ChatSocketId).emit('kick')
      : this.server.to(member.user.ChatSocketId).emit('mute');
  }
}
