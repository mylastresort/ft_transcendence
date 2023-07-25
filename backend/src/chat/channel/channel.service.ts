import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { Socket } from 'socket.io';
import * as argon2 from 'argon2';

interface CreateChannel {
  channelName: string;
  image: string;
  description: string;
  isProtected: boolean;
  isPrivate: boolean;
  password?: string;
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
    console.log('channel: ', channel);
    let hashedPass = '';
    try {
      if (channel.isProtected) {
        hashedPass = await argon2.hash(channel.password);
      }
      return await this.prisma.channel.create({
        data: {
          channelName: channel.channelName,
          image: channel.image,
          description: channel.description,
          isProtected: channel.isProtected,
          isPrivate: channel.isPrivate,
          password: hashedPass,
          members: {
            create: {
              nickname: me.username,
              isOwner: true,
              isAdministator: true,
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
      console.log('channel err: ', error);
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
              isMember: true,
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
  async deleteChannel(me: Me, channel: any) {
    try {
      if (
        await this.prisma.member.findFirst({
          where: {
            userId: me.id,
            isOwner: true,
          },
        })
      ) {
        throw "you're not an owner";
      }
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

  // *members
  //read
  async getMembers(channelId: number) {
    try {
      return await this.prisma.member.findMany({
        where: {
          channleId: channelId,
          isMember: true,
        },
        include: {
          user: true,
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
      } else if (!member.isMember) {
        return this.prisma.member.update({
          where: {
            id: member.id,
          },
          data: {
            isMember: true,
          },
        });
      } else throw 'Member already exists';
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

  async joinChanned(me: Me, channel: any) {
    try {
      const getCh = await this.prisma.channel.findFirst({
        where: {
          id: channel.id,
        },
        select: {
          password: true,
          isProtected: true,
        },
      });
      if (getCh.isProtected && !( channel.password && await argon2.verify(getCh.password, channel.password))) {
        throw 'Password Incorrect!';
      } else {
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
            select: {
              channel: true,
            },
          });
        } else if (member.isBanned) {
          throw 'you have been banned from this channel';
        } else if (member.isMember) {
          throw "you'are an existing member of the channel";
        } else if (!member.isMember) {
          return await this.prisma.member.update({
            where: {
              id: member.id,
            },
            data: {
              isMember: true,
            },
            select: {
              channel: true,
            },
          });
        }
      }
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
  //leave
  async leaveChannel(me: Me, channel: any) {
    try {
      return await this.prisma.member.updateMany({
        where: {
          userId: me.id,
          channleId: channel.id,
        },
        data: {
          isMember: false,
          isOwner: false,
          isAdministator: false,
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

  //setAdministator
  async setChannelAdministator(me: Me, member: any) {
    try {
      if (
        await this.prisma.member.findMany({
          where: { userId: me.id, isOwner: true },
        })
      ) {
        throw "you\'re not an administrator";
      } else {
        return await this.prisma.member.updateMany({
          where: {
            userId: member.id,
            isMember: true,
          },
          data: {
            isAdministator: true,
          },
        });
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'cannot set Channel Administator',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //kick
  async kickMember(me: Me, member: any) {
    try {
      if (
        !await this.prisma.member.findMany({
          where: { userId: me.id, isAdministator: true },
        })
      ) {
        console.log('waaaaaaaaaaaaaa');
        throw "you\'re not an administrator";
      }
      return await this.prisma.member.updateMany({
        where: {
          nickname: member.nickname,
          isOwner: false,
        },
        data: {
          isMember: false,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'cannot kick member',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async muteMember(me: Me, member: any) {
    try {
      // if (
      //   !await this.prisma.member.findMany({
      //     where: { userId: me.id, isAdministator: true },
      //   })
      // ) {
      //   throw "you\'re not an administrator";
      // }
      return await this.prisma.member.updateMany({
        where: {
          nickname: member.nickname,
          isOwner: false,
        },
        data: {
          isMuted: true,
          // mutedTime: member.mutedTime,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'cannot kick member',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //ban
  async banMember(me: Me, member: any) {
    try {
      if (
        await this.prisma.member.findMany({
          where: { userId: me.id, isOwner: true },
        })
      ) {
        throw "you're not an administrator";
      }
      return await this.prisma.member.updateMany({
        where: {
          userId: member.id, //not done
          isAdministator: false,
          isOwner: false,
        },
        data: {
          isMember: false,
          isBanned: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'cannot ban member',
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
