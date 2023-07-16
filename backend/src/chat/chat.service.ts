import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io';



@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}
    async getRooms(user: any) {
        console.log("error!", user);
        try {
            const friends = await this.prisma.chat.findMany({
                where: {
                    members: user.id
                },
            });
          return friends;
        }
        catch (error) {
            throw new HttpException(
              {
                status: HttpStatus.BAD_REQUEST,
                error: 'Chats not found',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
        }
        async getUsers(){
        try {
            return await this.prisma.user.findMany();
        }
        catch (error) {
            throw new HttpException(
              {
                status: HttpStatus.BAD_REQUEST,
                error: 'Chats not found',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
    }
}
