import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { interval, map, switchMap, zip } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import Ball from './ball.class';
import { Room } from './room.class';
import { GameGateway } from './game.gateway';

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
      host.to(id).emit('joined', id, host.data, host.data);
      guest.to(id).emit('joined', id, guest.data, host.data);
    });

  @Inject(forwardRef(() => GameGateway)) private gate: GameGateway;

  constructor(private prisma: PrismaService) {}

  async getPlayer(id) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
        select: {
          location: true,
          username: true,
          imgProfile: true,
          id: true,
        },
      });
      const player =
        (await this.prisma.player.findUnique({
          where: { userId: id },
          select: {
            wins: true,
            level: true,
            currentStreak: true,
            longestStreak: true,
          },
        })) ||
        (await this.prisma.player.create({
          data: {
            user: { connect: { id } },
          },
          select: {
            wins: true,
            level: true,
            currentStreak: true,
            longestStreak: true,
          },
        }));
      return { user, player };
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  join(socket, body) {
    let alreadyJoined = false;
    for (const { data } of this.hosts) {
      if (data.user.id == socket.data.user.id) {
        alreadyJoined = true;
        break;
      }
    }
    for (const { data } of this.guests) {
      if (data.user.id == socket.data.user.id) {
        alreadyJoined = true;
        break;
      }
    }
    if (alreadyJoined) throw new WsException('Already joined');
    socket.data = { ...socket.data, ...body };
    (body.role === 'host' ? this.hosts : this.guests).add(socket);
    return true;
  }

  leave(socket) {
    if (socket.data.role)
      (socket.data.role === 'host' ? this.hosts : this.guests).delete(socket);
    delete socket.data.role;
    if (socket.data.gameId) {
      const room = this.rooms.get(socket.data.gameId);
      if (room) {
        this.gate.wss.to(room.id).emit('left', room.id);
        this.gate.wss
          .in([room.guest.sid, room.host.sid])
          .socketsLeave(socket.data.gameId);
        this.rooms.delete(socket.data.gameId);
      }
      delete socket.data.gameId;
    }
    return true;
  }

  ready(socket, ready: boolean) {
    if (!socket.data.gameId) throw new WsException('Not in room');
    this.rooms
      .get(socket.data.gameId)
      ?.markReady(socket.data, ready)
      .subscribe(async ([areReady, room]) => {
        const conf = {
          limit: Room.edges,
          paddle: Room.paddle,
          radius: Ball.radius,
        };
        if (areReady) {
          const values = room.start();
          socket.to(room.id).emit('started', conf);
          socket.emit('started', conf);
          await this.prisma.room.create({
            data: {
              id: room.id,
              players: {
                connect: [
                  { userId: room.host.user.id },
                  { userId: room.guest.user.id },
                ],
              },
              map: room.host.map,
              maxGames: room.maxGames,
              status: room.status,
            },
          });
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

  async pong(socket, key: number) {
    const room = this.rooms.get(socket.data.gameId);
    if (room && room.isFirst(key)) {
      const isOut = room.isBallOut();
      if (isOut) {
        this.broadcast(socket, 'scored', ...isOut);
        if (isOut[1] === 4) {
          room.games++;
          if (room.games === room.maxGames) {
            this.broadcast(socket, 'gameover', isOut[0]);
            room.status = 'finished';
            delete room.host.gameId;
            delete room.guest.gameId;
          } else {
            this.broadcast(socket, 'games:counter', room.games);
            room.resetPlayers();
            this.broadcast(socket, 'scored', 'host', 0);
            this.broadcast(socket, 'scored', 'guest', 0);
            const values = room.resetBall();
            setTimeout(() => {
              socket.to(room.id).emit('reset');
              socket.emit('reset');
              this.broadcast(socket, 'ping', ...values);
            }, 1000);
          }
        } else {
          const values = room.resetBall();
          setTimeout(() => {
            socket.to(room.id).emit('reset');
            socket.emit('reset');
            this.broadcast(socket, 'ping', ...values);
          }, 1000);
        }
        await this.prisma.room.update({
          where: { id: room.id },
          data: {
            hostScore: room.players.host[1],
            guestScore: room.players.guest[1],
            status: room.status,
            games: room.games,
          },
        });
        if (room.status === 'finished') this.rooms.delete(socket.data.gameId);
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

  async getGames(id) {
    return await this.prisma.player.findMany({
      where: { userId: id },
      select: {
        rooms: {
          take: 10,
        },
      },
    });
  }
}
