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

}
