import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async GetBlockedUsers(userId: number) {
    try {
      const blockedUsers = await this.prisma.blockedUser.findMany({
        where: {
          userId: userId,
        },
        select: {
          blockedUser: true,
        },
      });

      const blockedby = await this.prisma.blockedUser.findMany({
        where: {
          blockedUserId: userId,
        },
        select: {
          user: true,
        },
      });

      const blockedIds = blockedUsers.map(
        (blockedUser) => blockedUser.blockedUser.id,
      );
      const blockedbyIds = blockedby.map((blockedUser) => blockedUser.user.id);

      return [...blockedIds, ...blockedbyIds];
    }catch(err){
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUsers(username: any, me: any) {
    try {
      
      const blockedUsers = await this.GetBlockedUsers(me.id);
      return await this.prisma.user.findMany({
        where: {
          id: {
            notIn: blockedUsers,
          },
          username: {
            startsWith: username,
            not: me.username,
          },
        },
      });
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

  async updateSocketId(socketId: string, userId: number) {
    try {
      const res = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ChatSocketId: socketId,
        },
      });
      return res;
    } catch (error) {
      console.log('update socketId error!');
    }
  }

  async getUser(username: string) {
    try {
      const res = await this.prisma.user.findFirst({
        where: {
          username: username,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          sammary: true,
          status: true,
          imgProfile: true,
        },
      });
      return res;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'user not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
