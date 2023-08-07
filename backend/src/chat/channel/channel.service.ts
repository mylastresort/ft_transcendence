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
        include: {
          members: {
            include: {
              user: {
                select: {
                  ChatSocketId: true,
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
  async getChannel(me: Me, channelId: number) {
    try {
      return await this.prisma.channel.findFirst({
        where: {
          id: channelId,
        },
        include: {
          members: {
            where: {
              isMember: true,
            },
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
          error: 'channel not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

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
        orderBy: {
          updateAt: 'asc',
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

  async getMe(me: Me, channelId: number) {
    try {
      return await this.prisma.member.findFirst({
        where: {
          channleId: channelId,
          userId: me.id,
          isMember: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'getMe error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //create
  async createMember(channel: CreateMember) {
    try {
      this.updateMemberState(channel.newMember.id);
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
          include: {
            user: {
              select: {
                ChatSocketId: true,
              },
            },
          },
        });
      } else if (member.isBanned) {
        throw 'This member is banned';
      } else if (!member.isMember) {
        return this.prisma.member.update({
          where: {
            id: member.id,
          },
          data: {
            isMember: true,
          },
          include: {
            user: {
              select: {
                ChatSocketId: true,
              },
            },
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
      this.updateMemberState(me.id);
      const getCh = await this.prisma.channel.findFirst({
        where: {
          id: channel.id,
        },
        select: {
          password: true,
          isProtected: true,
        },
      });
      if (
        getCh.isProtected &&
        !(
          channel.password &&
          (await argon2.verify(getCh.password, channel.password))
        )
      ) {
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
              channel: {
                include: {
                  members: {
                    include: {
                      user: {
                        select: {
                          ChatSocketId: true,
                        },
                      },
                    },
                  },
                },
              },
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
              channel: {
                include: {
                  members: {
                    include: {
                      user: {
                        select: {
                          ChatSocketId: true,
                        },
                      },
                    },
                  },
                },
              },
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
      const res =  await this.prisma.member.findFirst({
        where: {
          userId: me.id,
          channleId: channel.id,
        },
        select: {
          nickname: true,
          channel: {
            select: {
              channelName: true,
            }
          }
        }
      })
      await this.prisma.member.updateMany({
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
      return res;
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
        throw "you're not an administrator";
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
  async membersSettings(me: Me, member: any) {
    try {
      if (
        !(await this.prisma.member.findMany({
          where: { userId: me.id, isAdministator: true },
        }))
      ) {
        throw "you're not an administrator";
      }
      await this.prisma.member.updateMany({
        where: {
          nickname: member.nickname,
          channel: {
            channelName: member.channelName,
          },
          isOwner: false,
        },
        data: member.isKick
          ? {
              isMember: false,
            }
          : member.isMute
          ? {
              isMuted: true,
              mutedTime: new Date(member.time),
            }
          : member.isBan
          ? {
              isMember: false,
              isBanned: true,
              bannedTime: new Date(member.time),
            }
          : {},
      });
      return await this.prisma.member.findFirst({
        where:{
          nickname: member.nickname,
          channel: {
            channelName: member.channelName,
          },
        },
        select: {
          nickname: true,
          channel: {
            select: {
              channelName: true,
            }
          },
          user:{
            select:{
              ChatSocketId: true,
            }
          }
        }
      })
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'cannot change member settings',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async adminSettings(me: Me, member: any) {
    try {
      if (
        !(await this.prisma.member.findMany({
          where: { userId: me.id, isAdministator: true },
        }))
      ) {
        throw "you're not an administrator";
      }
      return await this.prisma.member.updateMany({
        where: {
          nickname: member.nickname,
          isOwner: false,
          isAdministator: false,
        },
        data: {
          isAdministator: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'cannot change member settings',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async passwordSettings(me: Me, channel: any) {
    const isPass = channel.mode != 'r';
    try {
      if (
        !(await this.prisma.member.findMany({
          where: { userId: me.id, isOwner: true },
        }))
      ) {
        throw "you're not an Owner";
      }
      const hashedPass = isPass ? await argon2.hash(channel.pass) : '';
      return await this.prisma.channel.update({
        where: {
          id: channel.id,
        },
        data: {
          password: hashedPass,
          isProtected: isPass,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'cannot change member settings',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // messages
  // read
  async getMessages(channelId: any) {
    try {
      const messages = await this.prisma.channelMessage.findMany({
        where: {
          channelId: channelId,
        },
        include: {
          sender: {
            include: {
              user: true,
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
      this.updateMemberState(me.id);
      const sender = await this.prisma.member.findFirst({
        where: {
          userId: me.id,
          isMuted: false,
          isBanned: false,
          isMember: true,
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
        },
        include: {
          sender: {
            include: {
              user: true,
            },
          },
        },
      });
      await this.prisma.channel.update({
        where: {
          id: channel.id,
        },
        data: {
          messages: {
            connect: {
              id: createdMessage.id,
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

  async updateMemberState(userId: number) {
    try {
      await this.prisma.member.updateMany({
        where: {
          userId: userId,
          isMuted: true,
          mutedTime: { lt: new Date() },
        },
        data: {
          isMuted: false,
          mutedTime: null,
        },
      });
      await this.prisma.member.updateMany({
        where: {
          userId: userId,
          isBanned: true,
          bannedTime: { lt: new Date() },
        },
        data: {
          isBanned: false,
          bannedTime: null,
        },
      });
    } catch (error) {
      console.error('Error updating isMuted status:', error);
    }
  }
}
