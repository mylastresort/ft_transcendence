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
    origin: 'http://localhost:3000',
  },
})
@UseGuards(WsJwtGuard)
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  private connectedSockets: Map<number, Socket> = new Map<number, Socket>();

  constructor(private prisma: PrismaService) {}

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);

    client.on('connection', async (socket: Socket) => {
      this.connectedSockets.set(socket.data.id, socket);
      await this.prisma.user.update({
        where: {
          id: socket.data.id,
        },
        data: {
          status: 'online',
        },
      });

      await this.SendNotification(socket.data.id);

      socket.on('disconnect', async () => {
        this.connectedSockets.delete(socket.data.id);
        await this.prisma.user.update({
          where: {
            id: socket.data.id,
          },
          data: {
            status: 'offline',
          },
        });
      });
    });
  }

  async NewFriendReq(UserId: number, senderId: number) {
    const socket = this.connectedSockets.get(UserId);
    const socket2 = this.connectedSockets.get(senderId);

    if (socket) {
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
          userId: socket.data.id,
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
          id: socket.data.id,
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

      socket.emit('NewRequestNotification', sendername.username);
      socket.emit('RerenderFriends', 'rerender');
      await this.SendNotification(socket.data.id);
    }
    if (socket2) {
      socket2.emit('RerenderFriends', 'rerender');
    }
  }

  async CandelFriendReq(UserId: number, senderId: number) {
    const socket = this.connectedSockets.get(UserId);

    if (socket) {
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
          userId: socket.data.id,
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
          id: socket.data.id,
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

      socket.emit('CandelFriendReq', sendername.username);
      await this.SendNotification(socket.data.id);
    }
  }

  async CandelFriendReqNotif(receiverId: number) {
    const socket = this.connectedSockets.get(receiverId);

    if (socket) {
      socket.emit('CandelFriendReq', 'CanceledfrmSender');
      await this.SendNotification(socket.data.id);
    }
  }

  async SendNotification(UserId: number) {
    const Notifications = await this.prisma.notification.findMany({
      where: {
        userId: UserId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const socket = this.connectedSockets.get(UserId);
    if (socket) {
      socket.emit('GetNotifications', Notifications);
    }
  }

  async AcceptFriendReq(UserId: number, senderId: number) {
    const socket = this.connectedSockets.get(UserId);
    const socket2 = this.connectedSockets.get(senderId);

    if (socket) {
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
          userId: socket.data.id,
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
          id: socket.data.id,
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

      socket.emit('AcceptFriendReq', sendername.username);

      await this.SendNotification(socket.data.id);
    }
    if (socket2) {
      socket2.emit('AcceptFriendReq', 'Accepted');
    }
  }

  async RerenderFriends(UserId: number, senderId: number) {
    const socket = this.connectedSockets.get(UserId);
    const socket2 = this.connectedSockets.get(senderId);

    if (socket) {
      socket.emit('RerenderFriends', senderId);
    }
    if (socket2) {
      socket2.emit('RerenderFriends', UserId);
    }
  }

  @SubscribeMessage('ReadNotifications')
  async ReadNotifications(client: Socket) {
    await this.prisma.notification.updateMany({
      where: {
        userId: client.data.id,
      },
      data: {
        read: true,
      },
    });
    await this.SendNotification(client.data.id);
  }
}
