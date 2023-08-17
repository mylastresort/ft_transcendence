import { Socket } from 'socket.io';
import { User } from '@prisma/client';
import { UUID } from 'crypto';
import { Player } from './game.gateway';

export class _Player {
  constructor(
    private _userStatus: 'offline' | 'online' | 'ingame' | 'ready',
    public userAchievements: { name: string; description: string }[],
    public userCurrentStreak: number,
    public userId: User['id'],
    public userImgProfile: string,
    public userLastPlayed: Date,
    public userLevel: number,
    public userLongestStreak: number,
    public userLosses: number,
    public username: string,
    public userStatusWatchers: Player[],
    public userWins: number,
  ) {}

  currentGameId?: UUID;

  currentUserRole?: 'host' | 'guest';

  currentUserSocketId?: Socket['id'];

  hostSettableGames?: number;

  hostWishedGameMap?: string;

  hostWishedGameName?: string;

  hostWishedGameSpeed?: number;

  get userStatus() {
    return this._userStatus;
  }

  set userStatus(status: 'offline' | 'online' | 'ingame' | 'ready') {
    this.userStatusWatchers.forEach((watcher) =>
      watcher.emit('user-status', this.userId, status),
    );
    this._userStatus = status;
  }
}
