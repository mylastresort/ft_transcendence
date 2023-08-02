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
import { ChannelService } from './channel/channel.service';
import { PrivateChatService } from './private/privateChat.service';
import { ChatService } from './chat.service';
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
export default class ChatGateway {
  constructor(
    private chatService: ChatService,
    private channelService: ChannelService,
    private privateChatService: PrivateChatService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
    client.on('connection', (socket) => {
      console.log('chat member connected: ', socket.id);
      this.chatService.updateSocketId(socket.id, socket.data.id);
    });
    
    client.on('disconnect', ()=>{
      console.log('disconnecting...');
    })
  }

  // private chat

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

  // channels chat

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('channel/join-room')
  joinChannelRoom(
    @MessageBody() room: any,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('joinChannelRoom: ', room);
    client.join(room);
    // client.rooms.forEach((room) => {
    //   client.leave(room);
    // });
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
    const createdMessage = await this.channelService.createMessage(
      client.data,
      data,
    );
    this.server.to(data.name).emit('channel/newMsg', createdMessage);
    console.log("rooms: ",client.rooms);
  }
}
