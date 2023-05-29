import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/token.type';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private Prisma: PrismaService, private JwtService: JwtService) {}

  async hash(value: string) {
    return bcrypt.hash(value, 10);
  }

  async getTokens(userId: number, user_42: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.JwtService.signAsync(
        {
          sub: userId,
          user_42,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '1h',
        },
      ),

      this.JwtService.signAsync(
        {
          sub: userId,
          user_42,
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '1y',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(User: AuthDto): Promise<any> {
    const user = await this.Prisma.user.findUnique({
      where: {
        id_42: User.id,
      },
    });

    if (user) return user;
    if (!user) {
      const newUser = await this.Prisma.user.create({
        data: {
          id_42: User.id,
          username: User.login,
        },
      });

      if (newUser) {
        return newUser;
      } else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'User not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
