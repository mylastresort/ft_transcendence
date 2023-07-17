import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getRooms(user: any) {
    // console.log('error!', user);
    try {
      const rooms = await this.prisma.chat.findMany({
        where: {
          members:{
            some: {
              id: user.id
            }
          },
        },
      });
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

  async getUsers() {
    try {
      return await this.prisma.chat.findMany();
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
  
  async createRoom(room: any) {
    try {
      return this.prisma.chat.create({
        data: {
          roomName: room.name,
          roomIcon: room.icon,
          members: {
            connect: {
              id: room.users,
            }
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
