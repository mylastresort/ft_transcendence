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
          members: {
            some: {
              id: user.id,
            },
          },
        },
        include: {
          members: {
            where: {
              id: {
                not: user.id,
              },
            },
          },
        },
      });
      console.log('Res: getRooms=> ', rooms);
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
        where: {
          username: {
            startsWith: username,
            not: me.username,
          },
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
      const createdChat = await this.prisma.chat.findFirst({
        where: {
          name: room.name,
          isChannel: room.isChannel,
          members: {
            some: {
              username: room.users,
            },
          },
        },
      });
      if (createdChat) {
        console.log('chat not created: ', createdChat);
        return createdChat;
      } else {
        return await this.prisma.chat.create({
          data: {
            name: room.name,
            img: room.icon,
            isChannel: room.isChannel,
            members: {
              connect: [{ id: user.id }, { username: room.users }],
            },
          },
        });
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'room not created',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteRoom(room: any) {
    try {
      console.log("id: ", room.id);
      return await this.prisma.chat.delete({
        where:{
          id: room.id,
        }
      });
    } catch (error) {
      console.log(error)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'room not deleted',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Chat messages

  async getMessages(room: any) {
    try {
      const messages = await this.prisma.message.findMany({
        where: {
          chatId: room.id
        },
        include: {
          sendBy: true
        }
      });
      console.log("getMessages res: ", messages);
      return messages;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'room not created',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async createMessage(room: any) {
    interface Room{
      msg: {
        content: string
      }
    }
    try {
      const createdMessage = await this.prisma.chat.update({
        where: {
          id: room.id,
        },
        data: {
          Messages:{
            create: {
              content: room.msg.content,
              sendBy: {
                connect: {
                  username: room.msg.sendBy
                }
              }
            }
          }
        }
      });
      console.log("createdMessage res: ", createdMessage);
      return createdMessage;
    } catch (error) {
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
