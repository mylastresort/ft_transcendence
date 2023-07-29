import { randomUUID } from 'crypto';
import { every, map, of } from 'rxjs';
import Ball from './ball.class';
import { Player } from './game.gateway';

export class Room {
  private ball: Ball;

  public games = 1;

  public id = randomUUID();

  public maxGames;

  public status = 'waiting' as 'waiting' | 'playing' | 'finished';

  readonly players = { guest: [0, 0, 0], host: [0, 0, 0] };

  static readonly edges = [180, 150];

  static readonly paddle = 30;

  public isInvite = false;

  constructor(public host: Player['data'], public guest: Player['data']) {
    this.maxGames = host.hostSettableGames;
  }

  markReady(player: Player['data'], isReady: boolean) {
    player.userStatus = 'ready';
    return of(this.host, this.guest).pipe(
      every(({ userStatus }) => userStatus === 'ready'),
      map((areReady) => [areReady, this] as const),
    );
  }

  start() {
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

  move(player: Player['data'], crd: number) {
    if (crd > Math.abs(Room.edges[1])) throw new Error('Out of bounds');
    this.players[player.currentUserRole][0] = crd;
  }
}
