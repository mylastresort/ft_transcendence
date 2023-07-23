import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { Socket } from 'socket.io';
interface CreateChannel {
  channelName: string;
  image: string;
  description: string;
  isProtected: boolean;
  // ChannelPassword: string;
}
interface Me {
  id: number;
  imgProfile: string;
  level: number;
  username: string;
}
interface CreateMember {
  id: number;
  newMember: {
    id: number;
    nickname: string;
  }
}

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  //create
  async createChannel(me: Me, channel: CreateChannel) {
    try {
      return await this.prisma.channel.create({
        data: {
          channelName: channel.channelName,
          image: channel.image,
          description: channel.description,
          isprotected: channel.isProtected,
          owner: {
            create: {
              nickname: me.username,
              user: {
                connect: {
                  id: me.id,
                },
              },
            },
          },
          members: {
            create: {
              nickname: me.username,
              user: {
                connect: {
                  id: me.id,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'channel not created',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //read
  async getChannel(me: Me) {
    try {
      return await this.prisma.channel.findMany({
        where: {
          members: {
            some: {
              userId: me.id,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'channel not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //delete
  async deleteChannel(channel: any) {
    try {
      return await this.prisma.channel.delete({
        where: {
          id: channel.id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'channel not deleted',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //update
  async createMember(channel: CreateMember) {
    try {
      return await this.prisma.member.create({
        data: {
          nickname: channel.newMember.nickname,
          channel: {
            connect: {
              id: channel.id,
            }
          },
          user: {
            connect: {
              id: channel.newMember.id
            }
          }
        }
      })
    }catch (error) {
      console.log("err:", error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'createMember error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // messages
  // read
  async getMessages(channelId: any) {
    try {
      const messages = await this.prisma.channel.findFirst({
        where: {
          id: channelId,
        },
        select: {
          messages:{
            include: {
               sender:{
                include: {
                  user: true,
                }
               }
            }
          }
        },
      });
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
  async createMessage(me: Me, channel: any) {
    try {
      const sender = await this.prisma.member.findFirst({
        where: {
          userId: me.id,
        }
      })
      const createdMessage = await this.prisma.channelMessage.create({
        data: {
          content: channel.message.content,
          sender: {
            connect: {
              id: sender.id,
            }
          },
          channel: {
            connect:{
              id: channel.id,
            }
          }
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
