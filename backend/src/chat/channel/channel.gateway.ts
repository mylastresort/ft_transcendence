import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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

export default class ChannelGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('channel member connected: ', socket.id);

      socket.on('join-room', (room) => {
        console.log('joining => ', room);
        socket.join(room);

        this.server.to(room).emit('msg', 'You joined the room: ' + room);
      });
    });
  }

  @SubscribeMessage('join-room')
  joinRoom(@MessageBody() room: any, @ConnectedSocket() client: Socket): void {
    console.log('joinRoom: ', room);
    client.join(room);
  }

  @SubscribeMessage('sendMsg')
  SendMessage(@MessageBody() data: any): void {
    console.log('sendMsg: ', data);
    this.server.to(data.room).emit('newMsg', data.msg);
  }
}
