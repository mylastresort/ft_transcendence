import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { Socket } from 'socket.io';

@Injectable()
export class PrivateChatService {
  constructor(private prisma: PrismaService) {}

  //create
  async createPrivateChat(me: any, chatUser: any) {
    try {
      const createdChat = await this.prisma.privateChat.findFirst({
        where: {
          AND: [
            {
              members: {
                some: {
                  id: me.id,
                },
              },
            },
            {
              members: {
                some: {
                  username: chatUser.username,
                },
              },
            },
          ],
        },
      });
      if (createdChat) {
        return createdChat;
      } else {
        return await this.prisma.privateChat.create({
          data: {
            members: {
              connect: [{ id: me.id }, { username: chatUser.username }],
            },
          },
        });
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'room not created',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //read
  async getPrivateChat(me: any) {
    try {
      return await this.prisma.privateChat.findMany({
        where: {
          members: {
            some: {
              id: me.id,
            },
          },
        },
        include: {
          members: {
            where: {
              id: {
                not: me.id,
              },
            },
          },
          Messages: {
            orderBy: {
              sendAt: 'desc',
            },
            take: 1,
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

  //delete
  async deletePrivateChat(pChat: any) {
    try {
      return await this.prisma.privateChat.delete({
        where: {
          id: pChat.id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'room not deleted',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // messages

  // read
  async getMessages(chatId: number) {
    try {
      const messages = await this.prisma.privateChat.findFirst({
        where: {
          id: chatId,
        },
        select: {
          Messages:{
            include: {
              sendBy: true,
            }
          }
        },
      });
      return messages;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'getMessages error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // create
  async createMessage(me: any, chat: any) {
    try {
      const createdMessage = await this.prisma.privateMessage.create({
        data: {
          content: chat.message.content,
          sendBy: {
            connect: {
              id: me.id,
            },
          },
          chat: {
            connect: {
              id: chat.id,
            },
          },
        },
      });
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
