import { basename } from 'path';
import { GameGateway, Player } from './game.gateway';
import { _Player } from './_player.class';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { interval, map, switchMap, zip } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Room } from './room.class';
import { S3 } from 'aws-sdk';
import { User } from '@prisma/client';
import { WsException } from '@nestjs/websockets';
import * as fs from 'fs';
import Ball from './ball.class';

@Injectable()
export class GameService {
  private hosts = new Set<Player>();

  private guests = new Set<Player>();

  private rooms = new Map<Room['id'], Room>();

  private players = new Map<User['id'], Player[]>();

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

  private readonly achievments = [
    {
      name: 'New Comer',
      description: 'Welcome to your second home.',
      icon: './Uploads/excited.png',
    },
    {
      name: 'First Win',
      description: 'You won your first game.',
      icon: './Uploads/medal.png',
    },
    {
      name: 'Nostalgic',
      description: 'You played 1972 Pong.',
      icon: './Uploads/arcade-game.png',
      mapKey: 'Classic',
    },
    {
      description: 'You played Star Wars Pong.',
      icon: './Uploads/personal-droid.png',
      mapKey: 'StarWars',
      name: 'Wrrrp bleep.',
    },
    {
      description: 'You played Cyberpunk Pong.',
      icon: './Uploads/cyberpunk.png',
      mapKey: 'Cyberpunk',
      name: 'Draw The Line',
    },
    {
      description: 'You played at Dracula House.',
      icon: './Uploads/murderer.png',
      mapKey: 'WitchCraft',
      name: 'Fearless Vampire Hunter',
    },
    {
      description: 'You fought in Dragon Ball palace.',
      icon: './Uploads/dragon.png',
      mapKey: 'DragonBall',
      name: "Z-Warrior's Key",
    },
    {
      name: 'Level 1',
      description: 'You reached level 1',
      icon: './Uploads/trophy.png',
    },
    {
      name: 'Level 5',
      description: 'You reached level 1',
      icon: './Uploads/trophy.png',
    },
    {
      name: 'Level 10',
      description: 'You reached level 1',
      icon: './Uploads/trophy.png',
    },
  ];

  async onModuleInit() {
    const s3 = new S3({
      region: process.env.AWS_S3_REGION,
      signatureVersion: 'v4',
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });
    for (const achievement of this.achievments) {
      try {
        await this.prisma.achievement.create({
          data: {
            name: achievement.name,
            icon: achievement.icon,
            description: achievement.description,
          },
        });
        await fs.readFile(achievement.icon, (err, data) => {
          if (err) throw err;
          s3.upload(
            {
              Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
              Key: basename(achievement.icon),
              Body: data,
            },
            async (err, data) =>
              err
                ? console.warn(err)
                : await this.prisma.achievement.update({
                    where: { name: achievement.name },
                    data: { icon: data.Location },
                  }),
          );
        });
      } catch (err) {}
    }
    this.prisma.$use((params, next) => {
      switch (params.model) {
        case 'Room':
          if (
            params.action === 'update' &&
            params.args.data.status === 'finished'
          ) {
            const achievement = this.achievments.find(
              ({ mapKey }) => params.args.data.map === mapKey,
            );
            if (achievement)
              setImmediate(async () => {
                await this.prisma.achievement
                  .update({
                    where: { name: achievement.name },
                    data: {
                      players: {
                        connect: [
                          { userId: params.args.data.winner.connect.userId },
                          { userId: params.args.data.loser.connect.userId },
                        ],
                      },
                    },
                  })
                  .catch(() => {});
                await this.prisma.achievement
                  .update({
                    where: { name: 'First Win' },
                    data: {
                      players: {
                        connect: {
                          userId: params.args.data.winner.connect.userId,
                        },
                      },
                    },
                  })
                  .catch(() => {});
              });
          }
          break;
        case 'Player':
          if (params.action === 'update') {
            if (params.args.data.level >= 1)
              params.args.data.achievements = {
                connect: {
                  name:
                    params.args.data.level >= 10
                      ? 'Level 10'
                      : params.args.data.level >= 5
                      ? 'Level 5'
                      : 'Level 1',
                },
              };
          }
      }
      return next(params);
    });
  }

  async watchUserStatus(socket: Player, userId) {
    const user = await this.getPlayer(userId, false);
    if (user) {
      user.userStatusWatchers.push(socket);
      socket.emit('user-status', user.userId, user.userStatus);
    }
  }

  async unwatchUserStatus(socket: Player, userId) {
    const player = await this.getPlayer(userId, false);
    if (player) {
      const index = player.userStatusWatchers.indexOf(socket);
      if (index !== -1) player.userStatusWatchers.splice(index, 1);
    }
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
              achievements: {
                select: { name: true, description: true, icon: true, id: true },
              },
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
          isInvite: lazyRoom.isInvite,
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
        isInvite: room.isInvite,
      },
      host: room.host,
      guest: room.guest,
      status: room.status,
    };
  }

  chat(socket: Player, message: string) {
    if (socket.data.currentGameId)
      socket.to(socket.data.currentGameId).emit('chat', ...message);
  }

  async cancelInvite(
    playerId: Player['data']['userId'],
    id: Player['data']['currentGameId'],
  ) {
    const room = this.rooms.get(id);
    if (room) {
      if (
        !room.isInvite ||
        (room.host.userId !== playerId && room.guest.userId !== playerId)
      )
        throw new HttpException('Forbbidden', HttpStatus.FORBIDDEN);
      if (room.status === 'playing')
        throw new HttpException('Room is playing', HttpStatus.FORBIDDEN);
      await this.prisma.room.delete({ where: { id } });
      const hosts = this.players.get(room.host.userId);
      const guests = this.players.get(room.guest.userId);
      if (hosts) hosts[hosts.length - 1].emit('cancelled');
      if (guests) guests[guests.length - 1].emit('cancelled');
      this.rooms.delete(id);
    } else {
      const lazyRoom = await this.prisma.room.findUnique({
        where: { id },
        select: { players: { select: { userId: true } }, status: true },
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
      await this.prisma.room.delete({ where: { id } });
      const hosts = this.players.get(lazyRoom.players[0].userId);
      const guests = this.players.get(lazyRoom.players[1].userId);
      if (hosts) hosts[hosts.length - 1].emit('cancelled');
      if (guests) guests[guests.length - 1].emit('cancelled');
    }
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
        achievements: {
          select: { name: true, description: true, icon: true, id: true },
        },
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
      return new _Player(
        'online',
        player.achievements,
        player.currentStreak,
        user.id,
        user.imgProfile,
        player.lastPlayed,
        player.level,
        player.longestStreak,
        player._count.losses,
        user.username,
        [],
        player._count.wins,
      );
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  async join(socket: Player, body) {
    if (
      socket.data.userStatus === 'ingame' ||
      socket.data.userStatus === 'ready'
    )
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
    if (socket.data.userId !== Number(body.userId)) {
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
  }

  async leave(socket: Player) {
    (socket.data.currentUserRole === 'host' ? this.hosts : this.guests).delete(
      socket,
    );
    if (socket.data.currentGameId) {
      const room = this.rooms.get(socket.data.currentGameId);
      if (room) {
        const endedAt = new Date();
        const loser = socket.data;
        const winner =
          socket.data.userId === room.host.userId ? room.guest : room.host;
        const currentStreak = {
          increment:
            endedAt.valueOf() - winner.userLastPlayed.valueOf() >= 86400000
              ? 1
              : 0,
        };
        const level =
          2 * room.players[winner.currentUserRole][2] + winner.userLevel;
        const longestStreak = Math.max(
          winner.userLongestStreak,
          currentStreak.increment + winner.userCurrentStreak,
        );
        const data = {
          currentStreak,
          lastPlayed: endedAt,
          level,
          longestStreak,
        };
        if (room.status === 'waiting') socket.to(room.id).emit('cancelled');
        else {
          socket.to(room.id).emit('left', socket.data.username);
          await this.prisma.room.update({
            where: { id: room.id },
            data: {
              status: 'finished',
              games: room.games,
              endedAt,
              winner: { connect: { userId: winner.userId } },
              loser: { connect: { userId: loser.userId } },
              winnerPostLevel: level + winner.userLevel,
              losserLevel: loser.userLevel,
              map: room.host.hostWishedGameMap,
            },
          });
          const winnerUpdates = await this.prisma.player.update({
            where: { userId: winner.userId },
            data,
            select: {
              achievements: {
                select: { name: true, description: true, icon: true, id: true },
              },
              currentStreak: true,
              level: true,
              longestStreak: true,
              _count: { select: { wins: true, losses: true } },
            },
          });
          winner.userAchievements = winnerUpdates.achievements;
          winner.userCurrentStreak = winnerUpdates.currentStreak;
          winner.userLevel = winnerUpdates.level;
          winner.userLongestStreak = winnerUpdates.longestStreak;
          winner.userLastPlayed = endedAt;
          winner.userWins = winnerUpdates._count.wins;
          winner.userLosses = winnerUpdates._count.losses;
          const loserUpdates = await this.prisma.player.update({
            where: { userId: loser.userId },
            data: { lastPlayed: endedAt },
            select: {
              achievements: {
                select: { name: true, description: true, icon: true, id: true },
              },
              currentStreak: true,
              level: true,
              longestStreak: true,
              _count: { select: { wins: true, losses: true } },
            },
          });
          loser.userAchievements = loserUpdates.achievements;
          loser.userCurrentStreak = loserUpdates.currentStreak;
          loser.userLevel = loserUpdates.level;
          loser.userLongestStreak = loserUpdates.longestStreak;
          loser.userLastPlayed = endedAt;
          loser.userWins = loserUpdates._count.wins;
          loser.userLosses = loserUpdates._count.losses;
        }
        this.gate.wss
          .in([room.guest.currentUserSocketId, room.host.currentUserSocketId])
          .socketsLeave(socket.data.currentGameId);
        delete room.guest.currentGameId;
        delete room.guest.currentUserRole;
        delete room.guest.hostSettableGames;
        room.guest.userStatus = 'online';
        delete room.host.currentGameId;
        delete room.host.currentUserRole;
        delete room.host.hostSettableGames;
        delete room.host.hostWishedGameMap;
        delete room.host.hostWishedGameName;
        delete room.host.hostWishedGameSpeed;
        room.host.userStatus = 'online';
        this.rooms.delete(socket.data.currentGameId);
      }
    }
    socket.data.userStatus = 'offline';
    return true;
  }

  async currentGame(id: Player['data']['userId']) {
    return (await this.getPlayer(id, false)).currentGameId;
  }

  async ready(
    socket: Player,
    ready: boolean,
    id: Player['data']['currentGameId'],
  ) {
    if (socket.data.userStatus === 'ingame')
      throw new WsException('Already in game');
    let room: Room = this.rooms.get(id);
    if (!room) {
      const lazyRoom = await this.prisma.room.findUnique({
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
      if (!lazyRoom) throw new WsException('Room not found');
      if (!lazyRoom.players.some(({ userId }) => userId === socket.data.userId))
        throw new WsException('You are not in this room');
      if (lazyRoom.status === 'finished')
        throw new WsException('Room is finished');
      const host = await this.getPlayer(
        lazyRoom.hostId === lazyRoom.players[0].userId
          ? lazyRoom.players[0].userId
          : lazyRoom.players[1].userId,
        false,
      );
      const guest = await this.getPlayer(
        lazyRoom.hostId !== lazyRoom.players[0].userId
          ? lazyRoom.players[0].userId
          : lazyRoom.players[1].userId,
        false,
      );
      const opponent = socket.data.userId === host.userId ? guest : host;
      if (!opponent) throw new WsException('Player is offline');
      if (opponent.userStatus === 'ingame')
        throw new WsException('Player is already in game');
      host.currentUserRole = 'host';
      host.hostSettableGames = lazyRoom.maxGames;
      host.hostWishedGameMap = lazyRoom.map;
      host.hostWishedGameName = lazyRoom.name;
      host.hostWishedGameSpeed = lazyRoom.speed;
      guest.currentUserRole = 'guest';
      room = new Room(host, guest);
      room.isInvite = true;
      room.id = id;
      this.rooms.set(id, room);
    }
    if (!room) throw new WsException('Room not found');
    if (
      room.host.userId !== socket.data.userId &&
      room.guest.userId !== socket.data.userId
    )
      throw new WsException('You are not in this room');
    socket.data =
      room.host.userId === socket.data.userId ? room.host : room.guest;
    socket.data.userStatus = ready ? 'ready' : 'online';
    if (room.guest.userStatus === 'ready' && room.host.userStatus === 'ready') {
      room.guest.userStatus = 'ingame';
      room.host.userStatus = 'ingame';
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
          if (
            room.games > room.maxGames ||
            room.players.guest[2] > room.maxGames / 2 ||
            room.players.host[2] > room.maxGames / 2
          ) {
            this.broadcast(
              socket,
              'gameover',
              room.players.guest[2] > room.players.host[2] ? 'guest' : 'host',
            );
            room.status = 'finished';
            delete room.guest.currentGameId;
            delete room.guest.currentGameId;
            delete room.guest.currentUserRole;
            delete room.guest.hostSettableGames;
            room.guest.userStatus = 'online';
            delete room.host.currentGameId;
            delete room.host.currentGameId;
            delete room.host.currentUserRole;
            delete room.host.hostSettableGames;
            delete room.host.hostWishedGameMap;
            delete room.host.hostWishedGameName;
            delete room.host.hostWishedGameSpeed;
            room.host.userStatus = 'online';
          } else {
            this.broadcast(socket, 'games:counter', room.games, isOut[0]);
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
        if (room.status === 'finished') {
          const winnerId =
            room.players.guest[2] > room.players.host[2]
              ? room.guest.userId
              : room.host.userId;
          const player =
            room.players.guest[2] > room.players.host[2]
              ? room.guest
              : room.host;
          const currentStreak = {
            increment:
              Date.now() - new Date(player.userLastPlayed).valueOf() >= 86400000
                ? 1
                : 0,
          };
          const level =
            2 * room.players[isOut[0]][2] + room[isOut[0]].userLevel;
          const longestStreak =
            currentStreak.increment + player.userCurrentStreak >
            player.userLongestStreak
              ? currentStreak.increment + player.userCurrentStreak
              : player.userLongestStreak;
          const data = {
            currentStreak,
            longestStreak,
          };
          await this.prisma.player.update({
            where: { userId: winnerId },
            data: {
              level,
              ...data,
            },
          });
          const endedAt = new Date();
          await this.prisma.room.update({
            where: { id: room.id },
            data: {
              status: room.status,
              games: room.games,
              endedAt,
              winner: { connect: { userId: winnerId } },
              loser: {
                connect: {
                  userId:
                    winnerId === room.host.userId
                      ? room.guest.userId
                      : room.host.userId,
                },
              },
              winnerPostLevel: level,
              losserLevel:
                winnerId === room.host.userId
                  ? room.guest.userLevel
                  : room.host.userLevel,
              map: room.host.hostWishedGameMap,
            },
          });
          await this.prisma.player.updateMany({
            where: { userId: { in: [room.host.userId, room.guest.userId] } },
            data: { lastPlayed: endedAt },
          });
          socket.data.userLastPlayed = endedAt;
          const opponent = await this.getPlayer(room.host.userId, false);
          if (opponent) opponent.userLastPlayed = endedAt;
          const winner =
            socket.data.userId === winnerId ? socket.data : opponent;
          winner.userLevel = level;
          winner.userCurrentStreak += currentStreak.increment;
          winner.userLongestStreak = longestStreak;
          winner.userWins++;
          this.rooms.delete(socket.data.currentGameId);
        }
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
      if (room) room.move(socket.data, crd);
    } catch (err) {
      throw new WsException(err.message);
    }
    if (room) socket.to(room.id).emit('moved', crd);
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
