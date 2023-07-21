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
                }
              }
            },
            {
              members: {
                some: {
                  username: chatUser.username,
                }
              }
            }
          ]
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
  async getMessages(pChat: any) {
    try {
      const messages = await this.prisma.privateMessage.findMany({
        where: {
          chatId: pChat.id,
        },
        include: {
          sendBy: true,
        },
      });
      console.log('getMessages res: ', messages);
      return messages;
    } catch (error) {
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
  async createMessage(pChat: any) {
    try {
      const createdMessage = await this.prisma.privateChat.update({
        where: {
          id: pChat.id,
        },
        data: {
          Messages: {
            create: {
              content: pChat.msg.content,
              sendBy: {
                connect: {
                  username: pChat.msg.sendBy,
                },
              },
            },
          },
        },
      });
      console.log('createdMessage res: ', createdMessage);
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
