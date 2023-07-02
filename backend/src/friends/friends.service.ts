import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { WebsocketGateway } from 'src/gateway/websocket.gateway';
import { NotificationsGateway } from 'src/usergateway/notifications.gateway';

@Injectable()
export class FriendsService {
  constructor(
    private Prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async getUsers(user: any) {
    try {
      const friends = await this.Prisma.friend.findMany({
        where: {
          userId: user.id,
        },
        select: {
          friend: true,
        },
      });

      const friendsOf = await this.Prisma.friend.findMany({
        where: {
          friendId: user.id,
        },
        select: {
          user: true,
        },
      });

      const blocked = await this.Prisma.friend.findMany({
        where: {
          userId: user.id,
          blocked: true,
        },
        select: {
          friend: true,
        },
      });

      const friendIds = friends.map((friend) => friend.friend.id);
      const friendsOfIds = friendsOf.map((friend) => friend.user.id);
      const blockedIds = blocked.map((friend) => friend.friend.id);

      const users = await this.Prisma.user.findMany({
        where: {
          id: {
            notIn: [...friendIds, ...friendsOfIds, ...blockedIds, user.id],
          },
        },
        select: {
          id: true,
          username: true,
          imgProfile: true,
          createdAt: true,
          firstName: true,
          lastName: true,
          receivedRequests: {
            where: {
              senderId: user.id,
            },
          },

          sentRequests: {
            where: {
              receiverId: user.id,
            },
          },
        },
      });

      return users;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Users not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async SendFriendRequest(senderId: number, receiverId: number) {
    try {
      const friendRequest = await this.Prisma.friendRequest.create({
        data: {
          sender: { connect: { id: senderId } },
          receiver: { connect: { id: receiverId } },
          status: 'pending',
        },
      });
      await this.notificationsGateway.NewFriendReq(receiverId, senderId);
      await this.notificationsGateway.RerenderFriends(senderId, receiverId);

      return friendRequest;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Friend request not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async AcceptFriendRequest(receiverId: number, senderId: number) {
    try {
      const friendRequest = await this.Prisma.friendRequest.findFirst({
        where: {
          senderId: senderId,
          receiverId: receiverId,
        },
      });

      if (!friendRequest) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Friend request not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const friend = await this.Prisma.friend.create({
        data: {
          user: { connect: { id: senderId } },
          friend: { connect: { id: receiverId } },
        },
      });

      await this.Prisma.friendRequest.delete({
        where: {
          id: friendRequest.id,
        },
      });

      await this.notificationsGateway.AcceptFriendReq(senderId, receiverId);
      await this.notificationsGateway.RerenderFriends(senderId, receiverId);

      return friend;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Friend request not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async CancelFriendRequest(
    UserId: number,
    senderId: number,
    receiverId: number,
  ) {
    try {
      const friendRequest = await this.Prisma.friendRequest.findFirst({
        where: {
          senderId: senderId,
          receiverId: receiverId,
        },
      });

      if (!friendRequest) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Friend request not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.Prisma.friendRequest.delete({
        where: {
          id: friendRequest.id,
        },
      });

      if (UserId !== senderId) {
        await this.notificationsGateway.CandelFriendReq(senderId, receiverId);
      } else {
        await this.notificationsGateway.CandelFriendReqNotif(receiverId);
      }

      await this.notificationsGateway.RerenderFriends(senderId, receiverId);

      return { message: 'Friend request canceled' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Friend request not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async RemoveFriendFromList(userId: number, friendId: number) {
    try {
      await this.Prisma.friend.create({
        data: {
          user: { connect: { id: friendId } },
          friend: { connect: { id: userId } },
          status: 'removed',
        },
      });

      await this.Prisma.friend.create({
        data: {
          user: { connect: { id: userId } },
          friend: { connect: { id: friendId } },
          status: 'removed',
        },
      });

      return { message: 'Friend removed' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Friend not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async RejectFriendRequest(senderId: number, receiverId: number) {
    try {
      const friendRequest = await this.Prisma.friendRequest.findFirst({
        where: {
          senderId: senderId,
          receiverId: receiverId,
        },
      });

      if (!friendRequest) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Friend request not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.Prisma.friendRequest.delete({
        where: {
          id: friendRequest.id,
        },
      });

      return { message: 'Friend request rejected' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Friend request not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async unfriend(userId: number, friendId: number) {
    try {
      const friend = await this.Prisma.friend.findFirst({
        where: {
          userId: userId,
          friendId: friendId,
        },
      });

      const friend2 = await this.Prisma.friend.findFirst({
        where: {
          userId: friendId,
          friendId: userId,
        },
      });

      if (!friend && !friend2) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Friend not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (friend) {
        await this.Prisma.friend.delete({
          where: {
            id: friend.id,
          },
        });
      }

      if (friend2) {
        await this.Prisma.friend.delete({
          where: {
            id: friend2.id,
          },
        });
      }
      await this.notificationsGateway.RerenderFriends(userId, friendId);
      return { message: 'Friend removed' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Friend not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async BlockUser(userId: number, friendId: number) {
    try {
      const friend = await this.Prisma.friend.findFirst({
        where: {
          userId: userId,
          friendId: friendId,
        },
      });

      const friendOf = await this.Prisma.friend.findFirst({
        where: {
          userId: friendId,
          friendId: userId,
        },
      });

      if (!friend && !friendOf) {
        await this.Prisma.friend.create({
          data: {
            user: { connect: { id: userId } },
            friend: { connect: { id: friendId } },
            blocked: true,
            blockedBy: { connect: { id: userId } },
          },
        });
        await this.notificationsGateway.RerenderFriends(userId, friendId);
        return { message: 'User blocked' };
      }

      if (friend) {
        await this.Prisma.friend.update({
          where: {
            id: friend.id,
          },
          data: {
            blocked: true,
            blockedBy: { connect: { id: userId } },
          },
        });
      }

      if (friendOf) {
        await this.Prisma.friend.update({
          where: {
            id: friendOf.id,
          },
          data: {
            blocked: true,
            blockedBy: { connect: { id: userId } },
          },
        });
      }
      await this.notificationsGateway.RerenderFriends(userId, friendId);
      return { message: 'User blocked' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Friend not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async UnblockUser(userId: number, friendId: number) {
    try {
      const friend = await this.Prisma.friend.findFirst({
        where: {
          userId: userId,
          friendId: friendId,
        },
      });

      const friendOf = await this.Prisma.friend.findFirst({
        where: {
          userId: friendId,
          friendId: userId,
        },
      });

      if (!friend && !friendOf) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Friend not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (friend) {
        await this.Prisma.friend.delete({
          where: {
            id: friend.id,
          },
        });
      }

      if (friendOf) {
        await this.Prisma.friend.delete({
          where: {
            id: friendOf.id,
          },
        });
      }
      await this.notificationsGateway.RerenderFriends(userId, friendId);
      return { message: 'User unblocked' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Friend not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async GetFriends(userId: number, Username: string) {
    try {
      const User_id = await this.Prisma.user.findFirst({
        where: {
          username: Username,
        },
        select: {
          id: true,
        },
      });

      if (!User_id) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // let user_id = userId;
      const friends = await this.Prisma.friend.findMany({
        where: {
          userId: User_id.id,
          blocked: false,
        },
        select: {
          friend: true,
        },
      });

      const friendOf = await this.Prisma.friend.findMany({
        where: {
          friendId: User_id.id,
          blocked: false,
        },
        select: {
          user: true,
        },
      });

      const friendIds = friends.map((friend) => friend.friend.id);
      const friendOfIds = friendOf.map((friend) => friend.user.id);

      const users = await this.Prisma.user.findMany({
        where: {
          id: {
            in: [...friendIds, ...friendOfIds],
          },
        },
        select: {
          id: true,
          username: true,
          imgProfile: true,
          createdAt: true,
          firstName: true,
          lastName: true,
          status: true,
        },
      });

      return users;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async GetFriendRequests(userId: number) {
    try {
      const friendRequests = await this.Prisma.friendRequest.findMany({
        where: {
          OR: [
            {
              senderId: userId,
            },
            {
              receiverId: userId,
            },
          ],
        },
        select: {
          id: true,
          sender: true,
          receiver: true,
          status: true,
        },
      });

      return friendRequests;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async GetBlockedUsers(userId: number) {
    try {
      const friends = await this.Prisma.friend.findMany({
        where: {
          userId: userId,
          blocked: true,
        },
        select: {
          friend: true,
        },
      });

      const friendOf = await this.Prisma.friend.findMany({
        where: {
          friendId: userId,
          blocked: true,
        },
        select: {
          user: true,
        },
      });

      const friendIds = friends.map((friend) => friend.friend.id);
      const friendOfIds = friendOf.map((friend) => friend.user.id);

      const users = await this.Prisma.user.findMany({
        where: {
          id: {
            in: [...friendIds, ...friendOfIds],
          },
        },
        select: {
          id: true,
          username: true,
          imgProfile: true,
          createdAt: true,
          firstName: true,
          lastName: true,
          status: true,
          blockedBy: true,
        },
      });

      return users;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}