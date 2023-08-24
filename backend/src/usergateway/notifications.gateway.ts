import { Logger, OnModuleInit, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  MessageBody,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/ws-jwt/ws-jwt.guard';
import { SocketAuthMiddleware } from 'src/auth/ws.middleware';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  namespace: 'userws',
  cors: {
    origin: process.env.FRONTEND_DOMAIN,
  },
})
@UseGuards(WsJwtGuard)
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  private connectedSockets: Map<number, Socket[]> = new Map<number, Socket[]>();

  constructor(private prisma: PrismaService) {}

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
    try {
      client.on('connection', async (socket: Socket) => {
        if (this.connectedSockets.has(socket.data.id)) {
          this.connectedSockets.get(socket.data.id).push(socket);
        } else {
          this.connectedSockets.set(socket.data.id, [socket]);
        }

        const user = await this.prisma.user.findUnique({
          where: {
            id: socket.data.id,
          },
        });

        if (!user) {
          socket.disconnect();
          return;
        }

        try {
          await this.prisma.user.update({
            where: {
              id: socket.data.id,
            },
            data: {
              status: 'online',
            },
          });
        } catch (err) {
          console.log('Error updating user status:', err);
        }

        await this.SendNotification(socket.data.id);

        socket.on('disconnect', async () => {
          try {
            await this.prisma.user.update({
              where: {
                id: socket.data.id,
              },
              data: {
                status: 'offline',
              },
            });
          } catch (err) {
            console.log('Error updating user status:', err);
          }

          const sockets = this.connectedSockets.get(socket.data.id);
          if (sockets.length === 1) {
            this.connectedSockets.delete(socket.data.id);
          }
          if (sockets.length > 1) {
            const index = sockets.indexOf(socket);
            sockets.splice(index, 1);
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  async NewFriendReq(UserId: number, senderId: number) {
    try {
      const sockets = this.connectedSockets.get(UserId);
      const sockets2 = this.connectedSockets.get(senderId);

      if (sockets) {
        const sendername = await this.prisma.user.findUnique({
          where: {
            id: senderId,
          },
          select: {
            username: true,
          },
        });

        const notifications = await this.prisma.notification.findMany({
          where: {
            userId: UserId,
          },
        });

        if (notifications.length > 5) {
          await this.prisma.notification.delete({
            where: {
              id: notifications[notifications.length - 1].id,
            },
          });
        }

        await this.prisma.user.update({
          where: {
            id: UserId,
          },
          data: {
            notifications: {
              create: {
                message:
                  'You have a new friend request from ' + sendername.username,
                read: false,
              },
            },
          },
        });

        for (const socket of sockets) {
          await socket.emit('RerenderFriends', 'rerender');

          await socket.emit('NewRequestNotification', sendername.username);
        }
        await this.SendNotification(UserId);
      }
      if (sockets2) {
        for (const socket2 of sockets2) {
          await socket2.emit('RerenderFriends', 'rerender');
        }
        await this.SendNotification(senderId);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async CandelFriendReq(UserId: number, senderId: number) {
    try {
      const sockets = this.connectedSockets.get(UserId);

      if (sockets) {
        const sendername = await this.prisma.user.findUnique({
          where: {
            id: senderId,
          },
          select: {
            username: true,
          },
        });

        const notifications = await this.prisma.notification.findMany({
          where: {
            userId: UserId,
          },
        });

        if (notifications.length > 5) {
          await this.prisma.notification.delete({
            where: {
              id: notifications[notifications.length - 1].id,
            },
          });
        }

        await this.prisma.user.update({
          where: {
            id: UserId,
          },
          data: {
            notifications: {
              create: {
                message:
                  'You have a new friend request from ' + sendername.username,
                read: false,
              },
            },
          },
        });

        for (const socket of sockets) {
          await socket.emit('CandelFriendReq', sendername.username);
        }
        await this.SendNotification(UserId);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async CandelFriendReqNotif(receiverId: number) {
    try {
      const sockets = this.connectedSockets.get(receiverId);

      if (sockets) {
        for (const socket of sockets) {
          await socket.emit('CandelFriendReq', 'CanceledfrmSender');
        }
        await this.SendNotification(receiverId);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async SendNotification(UserId: number) {
    try {
      const Notifications = await this.prisma.notification.findMany({
        where: {
          userId: UserId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const sockets = this.connectedSockets.get(UserId);
      if (sockets) {
        for (const socket of sockets) {
          await socket.emit('GetNotifications', Notifications);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async AcceptFriendReq(UserId: number, senderId: number) {
    try {
      const sockets = this.connectedSockets.get(UserId);
      // const socket2 = this.connectedSockets.get(senderId);

      if (sockets) {
        const sendername = await this.prisma.user.findUnique({
          where: {
            id: senderId,
          },
          select: {
            username: true,
          },
        });

        const notifications = await this.prisma.notification.findMany({
          where: {
            userId: UserId,
          },
        });

        if (notifications.length > 5) {
          await this.prisma.notification.delete({
            where: {
              id: notifications[notifications.length - 1].id,
            },
          });
        }

        await this.prisma.user.update({
          where: {
            id: UserId,
          },
          data: {
            notifications: {
              create: {
                message: sendername.username + ' accepted your friend request',
                read: false,
              },
            },
          },
        });

        for (const socket of sockets) {
          await socket.emit('AcceptFriendReq', sendername.username);
        }

        await this.SendNotification(UserId);
      }
      // if (socket2) {
      //   socket2.emit('AcceptFriendReq', 'Accepted');
      // }
    } catch (err) {
      console.log(err);
    }
  }

  async RerenderFriends(UserId: number, senderId: number) {
    try {
      const sockets = this.connectedSockets.get(UserId);
      const sockets2 = this.connectedSockets.get(senderId);

      if (sockets) {
        for (const socket of sockets)
          await socket.emit('RerenderFriends', senderId);
      }
      if (sockets2) {
        for (const socket2 of sockets2)
          await socket2.emit('RerenderFriends', UserId);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async BlockedEvent(UserId: number, senderId: number) {
    try {
      const sockets = this.connectedSockets.get(UserId);
      const sockets2 = this.connectedSockets.get(senderId);

      if (sockets) {
        for (const socket of sockets)
          await socket.emit('BlockedEvent', senderId);
      }
      if (sockets2) {
        for (const socket2 of sockets2)
          await socket2.emit('BlockedEvent', UserId);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async UnBlockedEvent(UserId: number, senderId: number) {
    try {
      const sockets = this.connectedSockets.get(UserId);
      const sockets2 = this.connectedSockets.get(senderId);

      if (sockets) {
        for (const socket of sockets)
          await socket.emit('UnBlockedEvent', senderId);
      }
      if (sockets2) {
        for (const socket2 of sockets2)
          await socket2.emit('UnBlockedEvent', UserId);
      }
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('ReadNotifications')
  async ReadNotifications(client: Socket) {
    try {
      await this.prisma.notification.updateMany({
        where: {
          userId: client.data.id,
        },
        data: {
          read: true,
        },
      });
      await this.SendNotification(client.data.id);
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('SendGameInvite')
  async SendGameInvite(
    @MessageBody()
    data: {
      senderId: number;
      receiverUsername: string;
      gameid: string;
    },
  ) {
    try {
      const sender = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: data.senderId,
        },
        select: {
          username: true,
        },
      });

      const receiver = await this.prisma.user.findUniqueOrThrow({
        where: {
          username: data.receiverUsername,
        },
        select: {
          id: true,
          username: true,
        },
      });

      const sockets = this.connectedSockets.get(receiver.id);

      await this.prisma.user.update({
        where: {
          id: receiver.id,
        },
        data: {
          notifications: {
            create: {
              message: 'You have a game invite from ' + sender.username,
              gameid: data.gameid,
              receiverId: receiver.id,
              senderId: data.senderId,
              read: false,
            },
          },
        },
      });

      if (sockets) {
        for (const socket of sockets) {
          await socket.emit('GameInviteNotification', {
            senderId: data.senderId,
            receiverId: receiver.id,
            gameid: data.gameid,
            username: receiver.username,
          });
        }
        await this.SendNotification(receiver.id);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  @SubscribeMessage('AcceptedGameInvite')
  async AcceptedGameInvite(
    @MessageBody()
    data: {
      senderId: number;
      receiverId: number;
      gameid: string;
    },
  ) {
    try {
      const sockets = this.connectedSockets.get(data.senderId);

      const username = await this.prisma.user.findUnique({
        where: {
          id: data.receiverId,
        },
        select: {
          username: true,
        },
      });

      await this.prisma.user.update({
        where: {
          id: data.senderId,
        },
        data: {
          notifications: {
            create: {
              message: 'Your game invite was accepted by ' + username.username,
              gameid: data.gameid,
              receiverId: data.receiverId,
              senderId: data.senderId,
              read: false,
            },
          },
        },
      });

      if (sockets) {
        for (const socket of sockets) {
          await socket.emit('AcceptedGameInvite', {
            senderId: data.senderId,
            receiverId: data.receiverId,
            gameid: data.gameid,
            username: username.username,
          });
        }
      }

      await this.SendNotification(data.senderId);
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('InGame')
  async InGame(
    @MessageBody()
    data: {
      user1Id: number;
      user2Id: number;
    },
  ) {
    try {
      const sockets = this.connectedSockets.get(data.user1Id);
      const sockets2 = this.connectedSockets.get(data.user2Id);

      await this.prisma.user.update({
        where: {
          id: data.user1Id,
        },
        data: {
          status: 'In Game',
        },
      });

      await this.prisma.user.update({
        where: {
          id: data.user2Id,
        },
        data: {
          status: 'In Game',
        },
      });

      if (sockets) {
        for (const socket of sockets) {
          await socket.emit('InGame', 'InGame');
        }
      }
      if (sockets2) {
        for (const socket2 of sockets2) {
          await socket2.emit('InGame', 'InGame');
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('GameEnded')
  async GameEnded(
    @MessageBody()
    data: {
      user1Id: number;
      user2Id: number;
    },
  ) {
    try {
      const sockets = this.connectedSockets.get(data.user1Id);
      const sockets2 = this.connectedSockets.get(data.user2Id);

      await this.prisma.user.update({
        where: {
          id: data.user1Id,
        },
        data: {
          status: 'online',
        },
      });

      await this.prisma.user.update({
        where: {
          id: data.user2Id,
        },
        data: {
          status: 'online',
        },
      });

      if (sockets) {
        for (const socket of sockets) {
          await socket.emit('GameEnded', 'GameEnded');
        }
      }
      if (sockets2) {
        for (const socket2 of sockets2) {
          await socket2.emit('GameEnded', 'GameEnded');
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('UserStatus')
  async UserStatus(
    @MessageBody()
    data: {
      user1: number;
      user2: number;
    },
  ) {
    try {
      // const sockets = this.connectedSockets.get(data.user1);
      const sockets2 = this.connectedSockets.get(data.user2);
      const status = await this.prisma.user.findFirst({
        where: {
          id: data.user1,
        },
        select: {
          status: true,
        },
      });

      for (const socket2 of sockets2) {
        await socket2.emit('UserStatus', status.status);
      }
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('ClearNotification')
  async ClearNotification(
    @MessageBody()
    data: {
      gameid: string;
      user1: number;
      user2: number;
    },
  ) {
    console.log('ClearNotification', data);
    await this.prisma.notification.deleteMany({
      where: {
        gameid: data.gameid,
      },
    });

    await this.SendNotification(data.user1);
    await this.SendNotification(data.user2);
    try {
    } catch (err) {
      console.log(err);
    }
  }
}
