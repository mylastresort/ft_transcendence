import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getRooms(user: any) {
    try {
      const rooms = await this.prisma.chat.findMany({
        where: {
          members:{
            some: {
              id: user.id
            }
          }
        },
        include: {
          members: {
            where: {
              id: {
                not: user.id,
              }
            }
          }
          
        }
      });
      console.log("Res: getRooms=> ", rooms);
      return rooms;
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

  async getUsers(username: any, me: any) {
    try {
      return await this.prisma.user.findMany({
        where:{
          username: {
            startsWith: username,
            not: me.username,
          }
        },
        // select: {
        //   username: true
        // }
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
  
  async createRoom(user: any, room: any) {
    try {
      return this.prisma.chat.create({
        data: {
          name: room.name,
          img: room.icon,
          isChannel: room.isChannel,
          members: {
            connect: [
              {id: user.id},
              {username: room.users}
            ]
          }
        }
      });
    }catch (error) {
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'room not created',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  }
}
