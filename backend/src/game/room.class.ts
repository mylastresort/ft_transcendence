import { Room as RoomEntity } from '@prisma/client';
import { randomUUID } from 'crypto';
import { EMPTY, every, map, of } from 'rxjs';
import Ball from './ball.class';

export class Room implements RoomEntity {
  static readonly edges = [180, 150];

  static readonly paddle = 100;

  id = randomUUID();

  status = 'waiting';

  private ball: Ball;

  maxGames;

  private readonly players = { guest: [0, 0], host: [0, 0] };

  games = 0;

  constructor(public host, public guest) {
    this.maxGames = host.games;
    host.gameId = this.id;
    guest.gameId = this.id;
  }

  leave() {
    return EMPTY;
  }

  markReady(player, isReady: boolean) {
    player.ready = isReady;
    return of(this.host, this.guest).pipe(
      every(({ ready }) => Boolean(ready)),
      map((areReady) => [areReady, this] as const),
    );
  }

  start() {
    this.status = 'playing';
    this.ball = new Ball();
    return this.ball?.ping();
  }

  isBallOut() {
    const [BallX, BallY] = this.ball.crd;
    if (Math.abs(BallX) === Room.edges[0]) {
      const player = BallX > 0 ? 'guest' : 'host';
      const [pos] = this.players[player];
      if (BallY > pos + Room.paddle / 2 || BallY < pos - Room.paddle / 2) {
        const opponent = player === 'guest' ? 'host' : 'guest';
        const [, score] = this.players[opponent];
        this.players[opponent][1] = score + 1;
        return [opponent, score + 1] as const;
      }
    }
    return null;
  }

  isFirst(key: number) {
    return key === this.ball.dummyKey;
  }

  pong(key: number) {
    return this.ball.pong(key);
  }

  resetBall() {
    this.ball = new Ball();
    return this.ball.ping();
  }

  resetPlayers() {
    this.players.guest[1] = 0;
    this.players.host[1] = 0;
  }

  move(player, crd: number) {
    if (crd > Math.abs(Room.edges[1])) throw new Error('Out of bounds');
    this.players[player.role][0] = crd;
  }
}
