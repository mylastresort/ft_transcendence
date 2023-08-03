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
    return await this.chatService.getUsers(username, req.user);
  }
}
