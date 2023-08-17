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
import { PrivateChatService } from './privateChat.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('chat/private')
export class PriavteChatController {
  constructor(private privateChatService: PrivateChatService) {}

  //create
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async createPrivateChat(@Req() req: any): Promise<any> {
    return this.privateChatService.createPrivateChat(req.user, req.body);
  }

  //read
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getPrivateChat(@Req() req: any): Promise<any> {
    return this.privateChatService.getPrivateChat(req.user);
  }

  //delete
  @Post('delete')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async deletePrivateChat(@Req() req: any): Promise<any> {
    return this.privateChatService.deletePrivateChat(req.body.id);
  }

  // messages

  //read
  @Get('msgs')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getMessages(@Query('id') id: string) {
    return await this.privateChatService.getMessages(+id);
  }

  //create
  @Post('msgs')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async createMessage(@Req() req: any): Promise<any> {
    return this.privateChatService.createMessage(req.user, req.body);
  }
}
