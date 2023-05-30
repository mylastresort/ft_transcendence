import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private Prisma: PrismaService) {}

  async me(user: any) {
    const me = await this.Prisma.user.findUnique({
      where: {
        id_42: user.id,
      },
    });

    if (!me) {
      throw new HttpException('User not found', 404);
    } else {
      return me;
    }
  }
}
