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
import { ChannelService } from './channel.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('chat/channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  //create
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async createChannel(@Req() req: any): Promise<any> {
    console.log('createChannel=>', req.user, req.body);
    return this.channelService.createChannel(req.user, req.body);
  }

  //read
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getChannel(@Req() req: any): Promise<any> {
    console.log('getChannel=>', req.user);
    return this.channelService.getChannel(req.user);
  }

  //delete
  @Post('delete')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async deleteChannel(@Req() req: any): Promise<any> {
    console.log('deleteChannel=>', req.body);
    return this.channelService.deleteChannel(req.body);
  }

  //update

  @Post('create-member')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async createMember(@Req() req: any): Promise<any> {
    console.log('createMember=>', req.body);
    return this.channelService.createMember(req.body);
  }

  // messages

  //read
  @Get('msgs')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getMessages(@Query('id') id: any) {
    console.log('getMessages req:', id);
    return await this.channelService.getMessages(+id);
  }

  //create
  @Post('msgs')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async createMessage(@Req() req: any): Promise<any> {
    console.log('createMessage:', req.body);
    return this.channelService.createMessage(req.user, req.body);
  }
}
