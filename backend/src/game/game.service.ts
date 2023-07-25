import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { interval, map, switchMap, zip } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { WsException } from '@nestjs/websockets';
import Ball from './ball.class';
import { Room } from './room.class';
import { GameGateway, Player } from './game.gateway';
import { User } from '@prisma/client';

@Injectable()
export class GameService {
  private hosts = new Set<Player>();

  private guests = new Set<Player>();

  private rooms = new Map<Room['id'], Room>();

  private players = new Map<User['id'], [Player]>();

  private notifier$ = interval(3000)
    .pipe(
      switchMap(() =>
        zip(
          [...this.hosts].sort((a, b) => a.data.userLevel - b.data.userLevel),
          [...this.guests].sort((a, b) => a.data.userLevel - b.data.userLevel),
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
      host.data.currentGameId = id;
      guest.data.currentGameId = id;
      host.to(id).emit('joined', id, host.data, host.data);
      guest.to(id).emit('joined', id, guest.data, host.data);
    });

  @Inject(forwardRef(() => GameGateway)) private gate: GameGateway;

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.prisma.achievement.createMany({
      data: [
        { name: 'New Comer', description: 'Welcome to your second home' },
        { name: 'First Win', description: 'You won your first game' },
        { name: 'First Game', description: 'You played your first game' },
        { name: 'Level 1', description: 'You reached level 1' },
      ],
      skipDuplicates: true,
    });
    this.prisma.$use((params, next) => {
      switch (params.model) {
        case 'Room':
          if (params.action === 'update')
            setImmediate(async () => {
              const room = await this.prisma.room.findUnique({
                where: params.args.where,
                select: {
                  players: {
                    select: {
                      _count: { select: { rooms: true, wins: true } },
                      userId: true,
                    },
                  },
                },
              });
              room?.players.forEach(
                async ({ _count: { rooms, wins }, userId }) => {
                  const achievement: { name: string }[] = [];
                  if (params.args.data.status === 'finished' && !wins)
                    achievement.push({ name: 'First Win' });
                  if (rooms === 1) achievement.push({ name: 'First Game' });
                  if (achievement.length) {
                    await this.prisma.player.update({
                      where: { userId },
                      data: { achievements: { connect: achievement } },
                    });
                  }
                },
              );
            });
          break;
      }
      return next(params);
    });
  }

  addPlayerSocket(socket: Player) {
    const sockets = this.players.get(socket.data.userId);
    sockets
      ? sockets.push(socket)
      : this.players.set(socket.data.userId, [socket]);
  }

  async getGameConf(
    id: Player['data']['currentGameId'],
    playerId: Player['data']['userId'],
  ) {
    const room = this.rooms.get(id);
    if (!room) {
      const lazyRoom = await this.prisma.room.findUnique({
        where: { id },
        select: {
          players: {
            select: {
              _count: { select: { wins: true, losses: true } },
              achievements: { select: { name: true, description: true } },
              currentStreak: true,
              lastPlayed: true,
              level: true,
              longestStreak: true,
              user: { select: { username: true, imgProfile: true } },
              userId: true,
            },
          },
          map: true,
          maxGames: true,
          status: true,
          isInvite: true,
          name: true,
          speed: true,
          hostId: true,
        },
      });
      if (!lazyRoom)
        throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
      if (!lazyRoom.players.some(({ userId }) => userId === playerId))
        throw new HttpException(
          'You are not in this room',
          HttpStatus.FORBIDDEN,
        );
      if (lazyRoom.status === 'finished')
        throw new HttpException('Room is finished', HttpStatus.FORBIDDEN);
      return {
        conf: {
          map: lazyRoom.map,
          speed: lazyRoom.speed,
          games: lazyRoom.maxGames,
          name: lazyRoom.name,
        },
        [lazyRoom.players[0].userId === lazyRoom.hostId ? 'host' : 'guest']: {
          username: lazyRoom.players[0].user.username,
          userImgProfile: lazyRoom.players[0].user.imgProfile,
          userId: lazyRoom.players[0].userId,
          userLevel: lazyRoom.players[0].level,
          userWins: lazyRoom.players[0]._count.wins,
          userCurrentStreak: lazyRoom.players[0].currentStreak,
          userLongestStreak: lazyRoom.players[0].longestStreak,
        },
        [lazyRoom.players[1].userId === lazyRoom.hostId ? 'host' : 'guest']: {
          username: lazyRoom.players[1].user.username,
          userImgProfile: lazyRoom.players[1].user.imgProfile,
          userId: lazyRoom.players[1].userId,
          userLevel: lazyRoom.players[1].level,
          userWins: lazyRoom.players[1]._count.wins,
          userCurrentStreak: lazyRoom.players[1].currentStreak,
          userLongestStreak: lazyRoom.players[1].longestStreak,
        },
        status: lazyRoom.status,
      };
    }
    return {
      conf: {
        map: room.host.hostWishedGameMap,
        speed: room.host.hostWishedGameSpeed,
        games: room.host.hostSettableGames,
        name: room.host.hostWishedGameName,
      },
      host: room.host,
      guest: room.guest,
      status: room.status,
    };
  }

  async getPlayer(id: Player['data']['userId'], createOnNotFound = true) {
    const sockets = this.players.get(id);
    if (sockets && sockets.length) return sockets[sockets.length - 1].data;
    if (!createOnNotFound) return null;
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
        select: { username: true, imgProfile: true, id: true },
      });
      const select = {
        level: true,
        currentStreak: true,
        longestStreak: true,
        _count: { select: { wins: true, losses: true } },
        achievements: { select: { name: true, description: true } },
        lastPlayed: true,
      };
      const player =
        (await this.prisma.player.findUnique({
          where: { userId: id },
          select,
        })) ||
        (await this.prisma.player.create({
          data: {
            user: { connect: { id } },
            achievements: { connect: { name: 'New Comer' } },
            lastPlayed: new Date(new Date().setDate(new Date().getDate() - 1)),
          },
          select,
        }));
      return {
        userAchievements: player.achievements,
        userCurrentStreak: player.currentStreak,
        userId: user.id,
        userImgProfile: user.imgProfile,
        userLastPlayed: player.lastPlayed,
        userLevel: player.level,
        userLongestStreak: player.longestStreak,
        userLosses: player._count.losses,
        username: user.username,
        userWins: player._count.wins,
      } satisfies Player['data'];
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  async join(socket: Player, body) {
    if ((await this.getPlayer(socket.data.userId)).currentGameId)
      throw new WsException('Already in game');
    socket.data.currentUserRole = body.role;
    socket.data.hostWishedGameSpeed = body.speed;
    socket.data.hostSettableGames = body.games;
    socket.data.hostWishedGameName = body.name;
    socket.data.hostWishedGameMap = body.map;
    (body.role === 'host' ? this.hosts : this.guests).add(socket);
    return true;
  }

  async invite(socket: Player, body) {
    const guest = await this.getPlayer(Number(body.userId));
    if (!guest)
      throw new HttpException('Player is offline', HttpStatus.BAD_REQUEST);
    socket.data.hostWishedGameSpeed = body.speed;
    socket.data.hostSettableGames = body.games;
    socket.data.hostWishedGameName = body.name;
    socket.data.hostWishedGameMap = body.map;
    const room = new Room(socket.data, guest);
    room.isInvite = true;
    await this.prisma.room.create({
      data: {
        id: room.id,
        players: {
          connect: [
            { userId: room.host.userId },
            { userId: room.guest.userId },
          ],
        },
        hostId: room.host.userId,
        map: room.host.hostWishedGameMap,
        maxGames: room.host.hostSettableGames,
        name: room.host.hostWishedGameName,
        speed: room.host.hostWishedGameSpeed,
        status: 'waiting',
        isInvite: room.isInvite,
      },
    });
    return room.id;
  }

  async leave(socket: Player) {
    (socket.data.currentUserRole === 'host' ? this.hosts : this.guests).delete(
      socket,
    );
    if (socket.data.currentGameId) {
      const room = this.rooms.get(socket.data.currentGameId);
      if (room && !room.isInvite) {
        const winnerId =
          socket.data.userId === room.host.userId
            ? room.guest.userId
            : room.host.userId;
        const player =
          socket.data.userId === room.host.userId ? room.guest : room.host;
        const currentStreak = {
          increment:
            Date.now() - new Date(player.userLastPlayed).valueOf() >= 86400000
              ? 1
              : 0,
        };
        const level = {
          increment:
            0.2 *
            room.players[
              socket.data.currentUserRole === 'host' ? 'guest' : 'host'
            ][2],
        };
        const data = {
          achievements:
            player.userLevel < 1 && level.increment + player.userLevel >= 1
              ? { connect: { name: 'Level 1' } }
              : {},
          currentStreak,
          longestStreak:
            currentStreak.increment + player.userCurrentStreak >
            player.userLongestStreak
              ? currentStreak.increment + player.userCurrentStreak
              : player.userLongestStreak,
        };
        await this.prisma.player.update({
          where: { userId: winnerId },
          data: {
            level,
            lastPlayed: new Date(),
            ...data,
          },
        });
        if (room.status === 'waiting') socket.to(room.id).emit('cancelled');
        else {
          await this.prisma.room.update({
            where: { id: room.id },
            data: {
              status: 'finished',
              games: room.games,
              endedAt: new Date(),
              winner: { connect: { userId: winnerId } },
              loser: {
                connect: {
                  userId:
                    room.host.userId === winnerId
                      ? room.guest.userId
                      : room.host.userId,
                },
              },
              winnerPostLevel: level.increment + player.userLevel,
            },
          });
          socket.to(room.id).emit('left', socket.data.username);
        }
        this.gate.wss
          .in([room.guest.currentUserSocketId, room.host.currentUserSocketId])
          .socketsLeave(socket.data.currentGameId);
        delete room.guest.currentGameId;
        delete room.guest.currentUserRole;
        delete room.guest.hostSettableGames;
        delete room.guest.ready;
        delete room.host.currentGameId;
        delete room.host.currentUserRole;
        delete room.host.hostSettableGames;
        delete room.host.hostWishedGameMap;
        delete room.host.hostWishedGameName;
        delete room.host.hostWishedGameSpeed;
        delete room.host.ready;
        this.rooms.delete(socket.data.currentGameId);
      }
    }
    return true;
  }

  async ready(
    socket: Player,
    ready: boolean,
    id: Player['data']['currentGameId'],
  ) {
    if (socket.data.currentGameId && socket.data.currentGameId !== id)
      throw new WsException('Already in game');
    let room;
    if (socket.data.currentGameId)
      room = this.rooms.get(socket.data.currentGameId);
    else {
      room = await this.prisma.room.findUnique({
        where: { id },
        select: {
          players: { select: { userId: true } },
          status: true,
          maxGames: true,
          isInvite: true,
          map: true,
          speed: true,
          name: true,
          hostId: true,
        },
      });
      if (!room) throw new WsException('Room not found');
      if (!room.players.some(({ userId }) => userId === socket.data.userId))
        throw new WsException('You are not in this room');
      if (room.status === 'finished') throw new WsException('Room is finished');
      const host = await this.getPlayer(
        room.hostId === room.players[0].userId
          ? room.players[0].userId
          : room.players[1].userId,
        false,
      );
      const guest = await this.getPlayer(
        room.hostId !== room.players[0].userId
          ? room.players[0].userId
          : room.players[1].userId,
        false,
      );
      if (!host || !guest) throw new WsException('Player is offline');
      if (host.currentGameId || guest.currentGameId)
        throw new WsException('Player is already in game');
      host.currentUserRole = 'host';
      host.hostSettableGames = room.maxGames;
      host.hostWishedGameMap = room.map;
      host.hostWishedGameName = room.name;
      host.hostWishedGameSpeed = room.speed;
      guest.currentUserRole = 'guest';
      room = new Room(host, guest);
      room.isInvite = true;
      room.id = id;
      host.currentGameId = id;
      guest.currentGameId = id;
      this.rooms.set(id, room);
    }
    if (!room) throw new WsException('Room not found');
    if (
      room.host.userId !== socket.data.userId &&
      room.guest.userId !== socket.data.userId
    )
      throw new WsException('You are not in this room');
    socket.data.ready = ready;
    if (room.guest.ready && room.host.ready) {
      const config = {
        limit: Room.edges,
        paddle: Room.paddle,
        radius: Ball.radius,
        isInvite: room.isInvite,
      };
      const hosts = this.players.get(room.host.userId);
      await hosts[hosts.length - 1].join(room.id);
      const guests = this.players.get(room.guest.userId);
      await guests[guests.length - 1].join(room.id);
      const values = room.start();
      socket.to(room.id).emit('started', config);
      socket.emit('started', config);
      room.status = 'playing';
      room.host.currentUserRole = 'host';
      room.guest.currentUserRole = 'guest';
      room.host.currentGameId = room.id;
      room.guest.currentGameId = room.id;
      if (!room.isInvite)
        await this.prisma.room.create({
          data: {
            id: room.id,
            players: {
              connect: [
                { userId: room.host.userId },
                { userId: room.guest.userId },
              ],
            },
            hostId: room.host.userId,
            map: room.host.hostWishedGameMap,
            maxGames: room.maxGames,
            name: room.host.hostWishedGameName,
            speed: room.host.hostWishedGameSpeed,
            status: 'playing',
          },
        });
      setTimeout(async () => {
        await this.prisma.room.update({
          where: { id: room.id },
          data: { startedAt: new Date() },
        });
        socket.to(room.id).emit('ping', ...values);
        socket.emit('ping', ...values);
      }, 1000);
    }
    return true;
  }

  broadcast(socket: Player, event, ...args) {
    socket.to(socket.data.currentGameId).emit(event, ...args);
    socket.emit(event, ...args);
  }

  async pong(socket: Player, key: number) {
    const room = this.rooms.get(socket.data.currentGameId);
    if (room && room.isFirst(key)) {
      const isOut = room.isBallOut();
      if (isOut) {
        this.broadcast(socket, 'scored', ...isOut);
        if (isOut[1] === 4) {
          room.games++;
          room.players[isOut[0]][2]++;
          if (room.games === room.maxGames) {
            this.broadcast(socket, 'gameover', isOut[0]);
            room.status = 'finished';
            delete room.guest.currentGameId;
            delete room.guest.currentGameId;
            delete room.guest.currentUserRole;
            delete room.guest.hostSettableGames;
            delete room.guest.ready;
            delete room.host.currentGameId;
            delete room.host.currentGameId;
            delete room.host.currentUserRole;
            delete room.host.hostSettableGames;
            delete room.host.hostWishedGameMap;
            delete room.host.hostWishedGameName;
            delete room.host.hostWishedGameSpeed;
            delete room.host.ready;
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
        const winnerId =
          room.players.guest[2] > room.players.host[2]
            ? room.guest.userId
            : room.host.userId;
        const player =
          room.players.guest[2] > room.players.host[2] ? room.guest : room.host;
        const currentStreak = {
          increment:
            Date.now() - new Date(player.userLastPlayed).valueOf() >= 86400000
              ? 1
              : 0,
        };
        const level = { increment: 0.2 * room.players[isOut[0]][2] };
        const data = {
          achievements:
            player.userLevel < 1 && level.increment + player.userLevel >= 1
              ? { connect: { name: 'Level 1' } }
              : {},
          currentStreak,
          longestStreak:
            currentStreak.increment + player.userCurrentStreak >
            player.userLongestStreak
              ? currentStreak.increment + player.userCurrentStreak
              : player.userLongestStreak,
        };
        await this.prisma.player.update({
          where: { userId: winnerId },
          data: {
            level,
            ...data,
          },
        });
        await this.prisma.player.updateMany({
          where: { userId: { in: [room.host.userId, room.guest.userId] } },
          data: { lastPlayed: new Date() },
        });
        socket.data.userLastPlayed = new Date();
        const opponent = await this.getPlayer(room.host.userId, false);
        if (opponent) opponent.userLastPlayed = new Date();
        await this.prisma.room.update({
          where: { id: room.id },
          data: {
            status: room.status,
            games: room.games,
            endedAt: new Date(),
            winner:
              room.status === 'finished'
                ? { connect: { userId: winnerId } }
                : {},
            loser:
              room.status === 'finished'
                ? {
                    connect: {
                      userId:
                        winnerId === room.host.userId
                          ? room.guest.userId
                          : room.host.userId,
                    },
                  }
                : {},
            winnerPostLevel: level.increment + player.userLevel,
          },
        });
        if (room.status === 'finished')
          this.rooms.delete(socket.data.currentGameId);
      } else {
        const values = room.pong(key);
        if (values) {
          this.broadcast(socket, 'ping', ...values);
        }
      }
    }
  }

  move(socket: Player, crd: number) {
    const room = this.rooms.get(socket.data.currentGameId);
    try {
      room.move(socket.data, crd);
    } catch (err) {
      throw new WsException(err.message);
    }
    socket.to(room.id).emit('moved', crd);
    return true;
  }

  async getGames(id: Player['data']['userId']) {
    return (
      await this.prisma.player.findUniqueOrThrow({
        where: { userId: id },
        select: {
          rooms: {
            orderBy: { startedAt: 'asc' },
            where: { status: 'finished' },
            select: {
              winner: {
                select: {
                  user: { select: { username: true, imgProfile: true } },
                },
              },
              loser: {
                select: {
                  user: { select: { username: true, imgProfile: true } },
                },
              },
              startedAt: true,
              endedAt: true,
              winnerPostLevel: true,
            },
          },
        },
      })
    ).rooms;
  }
}
