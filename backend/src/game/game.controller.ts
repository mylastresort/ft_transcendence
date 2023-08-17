import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GameService } from './game.service';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller({
  path: 'game',
  version: '1',
})
export class GameController {
  constructor(
    private readonly game: GameService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('player/me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getAuthenticatedPlayer(@Req() req) {
    const player = await this.game.getPlayer(req.user.id);
    return {
      userId: player.userId,
      userImgProfile: player.userImgProfile,
      username: player.username,
      userLevel: player.userLevel,
      userWins: player.userWins,
      userLoses: player.userLosses,
      userCurrentStreak: player.userCurrentStreak,
      userLongestStreak: player.userLongestStreak,
      userAchievements: player.userAchievements,
    };
  }

  @Get('player/me/currentGame')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async currentGame(@Req() req) {
    return await this.game.currentGame(req.user.id);
  }

  @Post('player')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getPlayer(@Body('username') username: string) {
    if (!username)
      throw new HttpException('Username not provided', HttpStatus.BAD_REQUEST);
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const player = await this.game.getPlayer(user.id);
    return {
      userId: player.userId,
      userImgProfile: player.userImgProfile,
      username: player.username,
      userLevel: player.userLevel,
      userWins: player.userWins,
      userLoses: player.userLosses,
      userCurrentStreak: player.userCurrentStreak,
      userLongestStreak: player.userLongestStreak,
      userAchievements: player.userAchievements,
    };
  }

  @Post('games')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getGames(@Body('username') username: string) {
    if (!username)
      throw new HttpException('Username not provided', HttpStatus.BAD_REQUEST);
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return (await this.game.getGames(user.id)).map((game) => {
      const duration =
        new Date(game.endedAt).valueOf() - new Date(game.startedAt).valueOf();
      delete game.endedAt;
      // delete game.startedAt;
      return {
        ...game,
        duration: {
          hours: Math.floor(duration / 3600000),
          minutes: Math.floor((duration % 3600000) / 60000),
          seconds: Math.floor(((duration % 3600000) % 60000) / 1000),
        },
        status: game.winner.user.username,
        startedat: game.startedAt,
      };
    });
  }

  @Get('achievements')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getAchievements() {
    return await this.prisma.achievement.findMany();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getGameConf(@Req() req, @Param('id') id: UUID) {
    try {
      return this.game.getGameConf(id, req.user.id);
    } catch (err) {
      throw new HttpException(err.error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('invite/cancel/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async cancelInvite(@Param('id') id: UUID, @Req() req) {
    await this.game.cancelInvite(req.user.id, id);
  }
}
