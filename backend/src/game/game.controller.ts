import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GameService } from './game.service';
import { UUID } from 'crypto';

@Controller({
  path: 'game',
  version: '1',
})
export class GameController {
  constructor(private readonly game: GameService) {}
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getPlayer(@Req() req) {
    const player = await this.game.getPlayer(req.user.id);
    return {
      userId: player.userId,
      userImgProfile: player.userImgProfile,
      username: player.username,
      userLevel: player.userLevel,
      userWins: player.userWins,
      userCurrentStreak: player.userCurrentStreak,
      userLongestStreak: player.userLongestStreak,
    };
  }

  @Get('games')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getGames(@Req() req) {
    return (await this.game.getGames(req.user.id)).map((game) => {
      const duration =
        new Date(game.endedAt).valueOf() - new Date(game.startedAt).valueOf();
      delete game.endedAt;
      delete game.startedAt;
      return {
        ...game,
        duration: {
          hours: Math.floor(duration / 3600000),
          minutes: Math.floor((duration % 3600000) / 60000),
          seconds: Math.floor(((duration % 3600000) % 60000) / 1000),
        },
      };
    });
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
}
