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
import { ChannelService } from './channel.service';

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
    members.forEach((member) => {
      this.server
        .to(member.user.ChatSocketId)
        .emit('updateChannel', member.nickname);
    });
  }

  notifyMember(member, event) {
    console.log('kick/banned', member);
    const action =
      event == 'left'
        ? 'left'
        : event.isKick
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

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('addMember')
  addMember(@MessageBody() room: any, @ConnectedSocket() client: Socket): void {
    this.server
      .to(room.name)
      .emit('action', { target: room.target, action: 'added to channel' });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('channel/join-room')
  joinChannelRoom(
    @MessageBody() room: any,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(room);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('channel/leave-room')
  leavehannelRoom(
    @MessageBody() room: any,
    @ConnectedSocket() client: Socket,
  ): void {
    client.leave(room);
  }

  @SubscribeMessage('channel/sendMsg')
  async SendChannelMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const createdMessage = await this.channelService.createMessage(
        client.data,
        data,
      );
      this.server.to(data.name).emit('channel/newMsg', createdMessage);
    } catch (err) {
      console.log('message not sent!');
    }
  }




  @UseGuards(WsJwtGuard)
  @SubscribeMessage('channel/join-room')
  joinChannelRoom(
    @MessageBody() room: any,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('joinChannelRoom: ', room);
    client.join(room);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('channel/leave-room')
  leavehannelRoom(
    @MessageBody() room: any,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('leavehannelRoom: ', room);
    client.leave(room);
  }

  @SubscribeMessage('channel/sendMsg')
  async SendChannelMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('SendChannelMessage: ', data);
    try {
      const createdMessage = await this.channelService.createMessage(
        client.data,
        data,
      );
      this.server.to(data.name).emit('channel/newMsg', createdMessage);
    } catch (err) {
      console.log('message not sent!');
    }
  }
}
