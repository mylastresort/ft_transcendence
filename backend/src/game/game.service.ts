import { Injectable } from '@nestjs/common';
import { interval, map, switchMap, zip } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import Ball from './ball.class';
import { Room } from './room.class';

@Injectable()
export class GameService {
  private hosts = new Set<Socket>();

  private guests = new Set<Socket>();

  private rooms = new Map<Room['id'], Room>();

  private notifier$ = interval(3000)
    .pipe(
      switchMap(() =>
        zip(
          [...this.hosts].sort((a, b) => a.data.level - b.data.level),
          [...this.guests].sort((a, b) => a.data.level - b.data.level),
        ),
      ),
      map(([host, guest]) => {
        this.hosts.delete(host);
        this.guests.delete(guest);
        const room = new Room(host.data, guest.data);
        this.rooms.set(room.id, room);
        return { host, guest, room };
      }),
    )
    .subscribe(async ({ host, guest, room: { id } }) => {
      await host.join(id);
      await guest.join(id);
      host.to(id).emit('joined', id, guest.data, host.data);
      guest.to(id).emit('joined', id, host.data, host.data);
    });

  constructor(private prisma: PrismaService) {}

  async getPlayer(id) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
        select: {
          location: true,
          username: true,
          imgProfile: true,
        },
      });
      return {
        user,
        ...(await this.prisma.player.upsert({
          where: { userId: id },
          create: { user: { connect: { id } } },
          update: {},
          select: {
            wins: true,
            level: true,
            currentStreak: true,
            longestStreak: true,
          },
        })),
      };
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  join(socket, body) {
    if (socket.data.role) throw new WsException('Already joined');
    socket.data = { ...socket.data, ...body };
    (body.role === 'host' ? this.hosts : this.guests).add(socket);
    return true;
  }

  leave(socket) {
    if (socket.data.gameId) this.rooms.get(socket.data.gameId)?.leave();
    return true;
  }

  private syncGame() {}

  ready(socket, ready: boolean) {
    if (!socket.data.gameId) throw new WsException('Not in room');
    this.rooms
      .get(socket.data.gameId)
      ?.markReady(socket.data, ready)
      .subscribe(([areReady, room]) => {
        const conf = {
          limit: Room.edges,
          paddle: Room.paddle,
          radius: Ball.radius,
        };
        if (areReady) {
          const values = room.start();
          this.syncGame();
          socket.to(room.id).emit('started', conf);
          socket.emit('started', conf);
          setTimeout(() => {
            socket.to(room.id).emit('ping', ...values);
            socket.emit('ping', ...values);
          }, 1000);
        }
      });
    return true;
  }

  broadcast(socket, event, ...args) {
    socket.to(socket.data.gameId).emit(event, ...args);
    socket.emit(event, ...args);
  }

  pong(socket, key: number) {
    const room = this.rooms.get(socket.data.gameId);
    if (room.isFirst(key)) {
      const isOut = room.isBallOut();
      if (isOut) {
        this.broadcast(socket, 'scored', ...isOut);
        if (isOut[1] === 11) {
          room.games++;
          if (room.games === room.maxGames) {
            this.broadcast(socket, 'gameover', isOut[0]);
            delete room.host.gameId;
            delete room.guest.gameId;
          } else {
            this.broadcast(socket, 'games:counter', room.games);
            room.resetPlayers();
            this.broadcast(socket, 'scored', 'host', 0);
            this.broadcast(socket, 'scored', 'guest', 0);
            setTimeout(() => {
              socket.to(room.id).emit('reset');
              socket.emit('reset');
              const values = room.resetBall();
              this.broadcast(socket, 'ping', ...values);
            }, 1000);
          }
        } else {
          setTimeout(() => {
            socket.to(room.id).emit('reset');
            socket.emit('reset');
            const values = room.resetBall();
            this.broadcast(socket, 'ping', ...values);
          }, 1000);
        }
      } else {
        const values = room.pong(key);
        if (values) {
          this.broadcast(socket, 'ping', ...values);
        }
      }
    }
  }

  move(socket, crd: number) {
    const room = this.rooms.get(socket.data.gameId);
    try {
      room.move(socket.data, crd);
    } catch (err) {
      throw new WsException(err.message);
    }
    socket.to(room.id).emit('moved', crd);
    return true;
  }
}
