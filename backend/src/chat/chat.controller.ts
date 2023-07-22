import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}
  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async findAll(
    @Req() req: any,
    @Query('username') username: any,
  ): Promise<any> {
    console.log('findAll Users=>', req.user);
    return await this.chatService.getUsers(username, req.user);
  }

  
  // @Get()
  // @UseGuards(AuthGuard('jwt'))
  // @HttpCode(HttpStatus.OK)
  // @ApiBearerAuth()
  // async getRooms(@Req() req: any): Promise<any> {
  //   console.log('Req: getRoom=>', req.user);
  //   return this.chatService.getRooms(req.user);
  // }
  
  // @Post()
  // @UseGuards(AuthGuard('jwt'))
  // @HttpCode(HttpStatus.OK)
  // @ApiBearerAuth()
  // async createRoom(@Req() req: any): Promise<any> {
  //   console.log('createRoom', req.user, req.body);
  //   return this.chatService.createRoom(req.user, req.body);
  // }
  // @Post('delete')
  // @UseGuards(AuthGuard('jwt'))
  // @HttpCode(HttpStatus.OK)
  // @ApiBearerAuth()
  // async deleteRoom(@Req() req: any): Promise<any> {
  //   console.log('deleteRoom', req.body);
  //   return this.chatService.deleteRoom(req.body);
  // }

  // messages
  //get msgs
  // @Get('msgs')
  // // @UseGuards(AuthGuard('jwt'))
  // // @HttpCode(HttpStatus.OK)
  // // @ApiBearerAuth()
  // async getMessages(
  //   @Req() req: any,
  // ): Promise<any> {
  //   console.log('get messages req:', req.body);
  //   return await this.chatService.getMessages(req.body);
  // }
  // //Post msgs
  // @Post('msgs')
  // // @UseGuards(AuthGuard('jwt'))
  // // @HttpCode(HttpStatus.OK)
  // // @ApiBearerAuth()
  // async createMessage(@Req() req: any): Promise<any> {
  //   console.log('post messages:', req.body);
  //   return this.chatService.createMessage(req.body);
  // }
}
