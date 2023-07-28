import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: 'http://localhost:3000',
  },
})
export default class ChannelGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('channel member connected: ', socket.id);
      socket.on('join-room', (room) => {
        console.log('joining => ', room);
        // socket.to(room).emit('receive-message', message);
      })
    });
  }
//   @SubscribeMessage('')
//   sendMessage(content) {
//     console.log('content from server:', content);
//     this.server.emit('onMessage', content);
//     this.server.to
//   }
}
