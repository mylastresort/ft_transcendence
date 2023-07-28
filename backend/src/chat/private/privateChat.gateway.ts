import { OnModuleInit } from '@nestjs/common';
import {
    ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chat' })
    
export default class PriavteChatGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log('connected: ', socket.id);
            // this.server.emit()
        })
    }
    sendMessage(content: string){
        this.server.emit('msg', content);
    }
}
