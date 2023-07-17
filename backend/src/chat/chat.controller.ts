import { Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService){}
  // @Get()
  // async findAll(@Req() req: any): Promise<any> {
  //   console.log("called!", req.body);
  //   return this.chatService.getUsers();
  // }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getRooms(@Req() req: any) : Promise<any> {
    console.log("Req: getRoom=>", req.user);
    return this.chatService.getRooms(req.body);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async createRoom(@Req() req: any): Promise<any> {
    console.log("createRoom", req.user, req.body);
    return this.chatService.createRoom(req.user, req.body);
  }

}
