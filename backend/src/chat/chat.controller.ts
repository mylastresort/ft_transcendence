import { Controller, Get, Req } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService){}
  @Get()
  async findAll(@Req() req: any): Promise<any> {
    console.log("called!", req.body);
    return this.chatService.getUsers();
  }
}
