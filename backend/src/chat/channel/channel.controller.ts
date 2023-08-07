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
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import ChannelGateway from './channel.gateway';
import { ChannelService } from './channel.service';

@Controller('chat/channel')
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private channelGateway: ChannelGateway,
  ) {}

  //create
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async createChannel(@Req() req: any): Promise<any> {
    console.log('createChannel=>', req.user, req.body);
    const res = await this.channelService.createChannel(req.user, req.body);
    await this.channelGateway.updateChannel(res.members);
    return res;
  }

  //read
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getChannel(@Req() req: any, @Query('id') id: any): Promise<any> {
    console.log('getChannel1 =>', id);
    return this.channelService.getChannel(req.user, +id);
  }

  @Get('public')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getPublicChannel(@Req() req: any): Promise<any> {
    console.log('getPublicChannel=>', req.user);
    return this.channelService.getPublicChannel(req.user);
  }
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getMyChannel(@Req() req: any): Promise<any> {
    // console.log('getMyChannel=>', req.user);
    return this.channelService.getMyChannel(req.user);
  }

  //delete
  @Post('delete')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async deleteChannel(@Req() req: any): Promise<any> {
    console.log('deleteChannel=>', req.body);
    return this.channelService.deleteChannel(req.user, req.body);
  }

  //update

  // *members
  //read
  @Get('members')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getMembers(@Query('id') id: any) {
    console.log('getMembers req:', +id);
    return await this.channelService.getMembers(+id);
  }

  @Get('members/me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getMe(@Req() req: any, @Query('id') id: any) {
    console.log('getMe req:', +id);
    return await this.channelService.getMe(req.user, +id);
  }
  //leave
  @Post('leave')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async leaveChannel(@Req() req: any): Promise<any> {
    console.log('leaveChannel=>', req.body);
    const res = await this.channelService.leaveChannel(req.user, req.body);

    this.channelGateway.notifyMember(res, 'left');
    return res;
  }

  @Post('settings/members')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async membersSettings(@Req() req: any): Promise<any> {
    console.log('membersSettings=>', req.body);
    const res = await this.channelService.membersSettings(req.user, req.body);

    this.channelGateway.notifyMember(res, req.body);

    return res;
  }

  @Post('settings/admin')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async adminSettings(@Req() req: any): Promise<any> {
    console.log('adminSettings=>', req.body);
    return this.channelService.adminSettings(req.user, req.body);
  }

  @Post('settings/password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async passwordSettings(@Req() req: any): Promise<any> {
    console.log('passwordSettings=>', req.body);
    return this.channelService.passwordSettings(req.user, req.body);
  }

  //create
  @Post('create-member')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async createMember(@Req() req: any): Promise<any> {
    console.log('createMember=>', req.body);
    const res = await this.channelService.createMember(req.body);
    await this.channelGateway.updateChannel([res]);
    return res;
  }

  @Post('join')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async joinChanned(@Req() req: any): Promise<any> {
    console.log('joinChanned=>', req.body);
    const res = await this.channelService.joinChanned(req.user, req.body);
    await this.channelGateway.updateChannel(res.channel.members);
    return res;
  }

  // *messages
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
