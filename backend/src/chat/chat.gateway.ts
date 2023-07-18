import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
// import { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class ChatGateway {
    @WebSocketServer()
    server;

    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string): void {
        this.server.emit('message', message)
    }
    @SubscribeMessage('message')
    newConnection(@MessageBody() req: string): void {
        this.server.emit('room', req)
    }
    onModuleInit(){
        this.server.on("connection", (socket) => {
           console.log("connected:", socket.id);
            console.log(socket)
        })
    }
}