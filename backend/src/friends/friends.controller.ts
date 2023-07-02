import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FriendsService } from './friends.service';

@ApiTags('Friends')
@Controller({
  path: 'friends',
  version: '1',
})
export class FriendsController {
  constructor(public service: FriendsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('Users-Not-Friends')
  @HttpCode(HttpStatus.OK)
  async getUsers(@Req() req: any) {
    return this.service.getUsers(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('SendFriendRequest')
  @HttpCode(HttpStatus.OK)
  async SendFriendRequest(@Req() req: any, @Body() body: any) {
    return this.service.SendFriendRequest(req.user.id, body.receiverId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('AcceptFriendRequest')
  @HttpCode(HttpStatus.OK)
  async AcceptFriendRequest(@Req() req: any, @Body() body: any) {
    return this.service.AcceptFriendRequest(req.user.id, body.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('CancelFriendRequest')
  @HttpCode(HttpStatus.OK)
  async CancelFriendRequest(@Req() req: any, @Body() body: any) {
    return this.service.CancelFriendRequest(
      req.user.id,
      body.senderId,
      body.receiverId,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('RemoveFriendFromList')
  @HttpCode(HttpStatus.OK)
  async RemoveFriendFromList(@Req() req: any, @Body() body: any) {
    return this.service.RemoveFriendFromList(req.user.id, body.receiverId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('RejectFriendRequest')
  @HttpCode(HttpStatus.OK)
  async RejectFriendRequest(@Req() req: any, @Body() body: any) {
    return this.service.RejectFriendRequest(req.user.id, body.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('unfriend')
  @HttpCode(HttpStatus.OK)
  async unfriend(@Req() req: any, @Body() body: any) {
    return this.service.unfriend(req.user.id, body.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('BlockUser')
  @HttpCode(HttpStatus.OK)
  async BlockUser(@Req() req: any, @Body() body: any) {
    return this.service.BlockUser(req.user.id, body.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('UnblockUser')
  @HttpCode(HttpStatus.OK)
  async UnblockUser(@Req() req: any, @Body() body: any) {
    return this.service.UnblockUser(req.user.id, body.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('GetFriends')
  @HttpCode(HttpStatus.OK)
  async GetFriends(@Req() req: any, @Body() body: any) {
    return this.service.GetFriends(req.user.id, body.ofuser);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('GetFriendRequests')
  @HttpCode(HttpStatus.OK)
  async GetFriendRequests(@Req() req: any, @Body() body: any) {
    return this.service.GetFriendRequests(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('GetBlockedUsers')
  @HttpCode(HttpStatus.OK)
  async GetBlockedUsers(@Req() req: any) {
    return this.service.GetBlockedUsers(req.user.id);
  }
}
