import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from '../chat.service';
// import { Socket } from 'socket.io';

@Injectable()
export class PrivateChatService {
  constructor(
    private prisma: PrismaService,
    private chatService: ChatService,
  ) {}

  //create
  async createPrivateChat(me: any, chatUser: any) {
    try {
      const blockedUsers = await this.chatService.GetBlockedUsers(me.id);
      if (blockedUsers.includes(chatUser.id)) {
        throw 'this user is blocked';
      }
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
        include: {
          members: {
            where: {
              id: {
                not: me.id,
              },
            },
          },
        }
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
          include: {
            members: {
              where: {
                id: {
                  not: me.id,
                },
              },
            },
          }
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
      const blockedUsers = await this.chatService.GetBlockedUsers(me.id);
      return await this.prisma.privateChat.findMany({
        where: {
          members: {
            none: {
              id: {
                in: blockedUsers,
              },
            },
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
  async deletePrivateChat(chatId: any) {
    try {
      return await this.prisma.privateChat.delete({
        where: {
          id: chatId,
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
          Messages: {
            include: {
              sender: true,
            },
          },
        },
      });
      return messages.Messages;
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
          sender: {
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
        include: {
          sender: true,
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
