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
import { ChatService } from './chat.service';

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
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
    client.on('connection', (socket) => {
      this.chatService.updateSocketId(socket.id, socket.data.id);
    });
    
    client.on('disconnect', ()=>{
      console.log('disconnecting...');
    })
  }

}
