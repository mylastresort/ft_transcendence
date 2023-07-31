// import { OnModuleInit, UseGuards } from '@nestjs/common';
// import {
//   ConnectedSocket,
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { WsJwtGuard } from 'src/auth/ws-jwt/ws-jwt.guard';
// import { SocketAuthMiddleware } from 'src/auth/ws.middleware';
// import { ChannelService } from './channel.service';

// interface Message{
//   room: string;
//   msg: string;
// }
// @WebSocketGateway({
//   namespace: 'chat',
//   cors: {
//     origin: 'http://localhost:3000',
//   },
// })

// @UseGuards(WsJwtGuard)
// export default class ChannelGateway {
//   constructor(private channelService: ChannelService){}
//   @WebSocketServer()
//   server: Server;

//   afterInit(client: Socket) {
//     client.use(SocketAuthMiddleware() as any);
//     client.on('connection', (socket) => {
//       console.log('channel member connected: ', socket.id);
//     });
//   }

//   @UseGuards(WsJwtGuard)
//   @SubscribeMessage('join-room')
//   joinRoom(@MessageBody() room: any, @ConnectedSocket() client: Socket): void {
//     client.rooms.forEach((room)=>{
//       client.leave(room);
//     })
//     client.join(room);
//     console.log('joinedRooms: ', client.rooms);
//   }
//   @UseGuards(WsJwtGuard)
//   @SubscribeMessage('leave-room')
//   leaveRoom(@MessageBody() room: any, @ConnectedSocket() client: Socket): void {
//     console.log('leaveRoom: ', room);
//     client.leave(room);
//   }

//   @SubscribeMessage('sendMsg')
//   async SendMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
//     console.log('sendMsg: ', data, 'by: ', client.data);
//     const createdMessage = await this.channelService.createMessage(client.data, data);
//     console.log(createdMessage);
//     this.server.to(data.name).emit('newMsg', createdMessage);
//   }
// }
