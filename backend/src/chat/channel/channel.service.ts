import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { Socket } from 'socket.io';
interface CreateChannel {
  channelName: string;
  image: string;
  description: string;
  isProtected: boolean;
  isPrivate: boolean;
  ChannelPassword?: string;
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
  };
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
          isProtected: channel.isProtected,
          isPrivate: channel.isPrivate,
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
        select: {
          owner:{
            select: {
              userId: true,
            }
          }
        }
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
  async getPublicChannel(me: Me) {
    try {
      return await this.prisma.channel.findMany({
        where: {
          isPrivate: false,
        },
        include: {
          owner:{
            select:{
              userId: true
            }
          },
        }
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
  async getMyChannel(me: Me) {
    try {
      return await this.prisma.channel.findMany({
        where: {
          members: {
            some: {
              userId: me.id,
            },
          },
        },
        include: {
          owner:{
            select:{
              userId: true
            }
          },
        }
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

  //leave
  async leaveChannel(member: any) {
    try {
      return await this.prisma.member.deleteMany({
        where: {
            userId: member.id,
            AND: {
              channleId: member.chId,
            }
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'cannot leave channel',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //update

  // *members
  //read
  async getMembers(channelId: number) {
    try {
      return await this.prisma.channel.findFirst({
        where: {
          id: channelId,
        },
        select: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'getMembers error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //create
  async createMember(channel: CreateMember) {
    try {
      const member = await this.prisma.member.findFirst({
        where: {
          user: {
            id: channel.newMember.id,
          },
          AND: {
            channel: {
              id: channel.id,
            },
          },
        },
      });
      if (!member) {
        return await this.prisma.member.create({
          data: {
            nickname: channel.newMember.nickname,
            channel: {
              connect: {
                id: channel.id,
              },
            },
            user: {
              connect: {
                id: channel.newMember.id,
              },
            },
          },
        });
      }
      throw "Member already exists";
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: error,
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async joinChanned(me: Me, channel){
    try {
      const member = await this.prisma.member.findFirst({
        where: {
          user: {
            id: me.id,
          },
          AND: {
            channel: {
              id: channel.id,
            },
          },
        },
      });
      if (!member) {
        return await this.prisma.member.create({
          data: {
            nickname: me.username,
            channel: {
              connect: {
                id: channel.id,
              },
            },
            user: {
              connect: {
                id: me.id,
              },
            },
          },
        });
      }
      throw "you\'are an existing member of the channel";
    } catch (error) {
      console.log('err:', error);
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: error,
        },
        HttpStatus.NOT_ACCEPTABLE,
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
          messages: {
            include: {
              sender: {
                include: {
                  user: true,
                },
              },
            },
          },
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
        },
      });
      const createdMessage = await this.prisma.channelMessage.create({
        data: {
          content: channel.message.content,
          sender: {
            connect: {
              id: sender.id,
            },
          },
          channel: {
            connect: {
              id: channel.id,
            },
          },
        },
      });
      return createdMessage;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'message not created',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
