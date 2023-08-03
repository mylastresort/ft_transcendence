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

  notifyMember(member, event) {
    console.log('kick/banned', member);
    const action = event.isKick
      ? 'kicked'
      : event.isBan
      ? 'banned'
      : event.isMute
      ? 'muted'
      : '';

    this.server
      .to(member.channel.channelName)
      .emit('action', { target: member.nickname, action: action });
  }
}
