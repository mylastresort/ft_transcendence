import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getUsers(username: any, me: any) {
    try {
      return await this.prisma.user.findMany({
        where: {
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
          error: 'Chats not found',
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
      console.log('updating chat socket id ...');
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

  async getBlocked(me: any) {
    try {
      this.prisma.user.findFirst({
        where: {
          id: me.id,
        },
        select: {
          blockedBy: {},
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'blocked not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
