import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { Socket } from 'socket.io';
interface CreateChannel {
  channelName: string;
  image: string;
  description: string;
  // ChannelPassword: string;
}
interface Me {
  id: number;
  imgProfile: string;
  level: number;
  username: string;
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
}

// messages

// read
// async getMessages(pChat: any) {
//   try {
//     const messages = await this.prisma.privateMessage.findMany({
//       where: {
//         chatId: pChat.id,
//       },
//       include: {
//         sendBy: true,
//       },
//     });
//     console.log('getMessages res: ', messages);
//     return messages;
//   } catch (error) {
//     throw new HttpException(
//       {
//         status: HttpStatus.BAD_REQUEST,
//         error: 'getMessages error',
//       },
//       HttpStatus.BAD_REQUEST,
//     );
//   }
// }

// create
//   async createMessage(pChat: any) {
//     try {
//       const createdMessage = await this.prisma.privateChat.update({
//         where: {
//           id: pChat.id,
//         },
//         data: {
//           Messages: {
//             create: {
//               content: pChat.msg.content,
//               sendBy: {
//                 connect: {
//                   username: pChat.msg.sendBy,
//                 },
//               },
//             },
//           },
//         },
//       });
//       console.log('createdMessage res: ', createdMessage);
//       return createdMessage;
//     } catch (error) {
//       throw new HttpException(
//         {
//           status: HttpStatus.BAD_REQUEST,
//           error: 'room not created',
//         },
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//   }
// }
