import { Controller, Get, Post, Req } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService){}
  // @Get()
  // async findAll(@Req() req: any): Promise<any> {
  //   console.log("called!", req.body);
  //   return this.chatService.getUsers();
  // }
  @Get()
  async getRooms(@Req() req: Request): Promise<any> {
    console.log(req.body);
    return this.chatService.getRooms(req.body);
  }

  @Post()
  async createRoom(@Req() req: Request): Promise<any> {
    console.log(req.body);
    return this.chatService.createRoom(req.body);
  }
}
