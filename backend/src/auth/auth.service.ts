import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/token.type';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

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

  async register(User: any): Promise<any> {
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
          imgProfile: User.image.link,
          firstName: User.first_name,
          lastName: User.last_name,
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

  async generateQRCode() {
    const secret = speakeasy.generateSecret({
      name: 'Your App Name',
    });

    const qrCodeUrl = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: 'Your App Name',
      issuer: 'Your App Issuer',
    });

    return new Promise<string>((resolve, reject) => {
      qrcode.toDataURL(qrCodeUrl, (error: any, url: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(url);
        }
      });
    });
  }

  async GettwoFactorAuth(User: any, body: any): Promise<any> {
    const user = await this.Prisma.user.findUnique({
      where: {
        id_42: User.id,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      if (user) {
        if (body.twoFactorAuth) {
          if (!user.qr2fa) {
            const qrCodeUrl = await this.generateQRCode();
            await this.Prisma.user.update({
              where: {
                id_42: User.id,
              },
              data: {
                twoFactorAuth: body.twoFactorAuth,
                qr2fa: qrCodeUrl,
              },
            });
            return { qrCodeUrl };
          } else {
            return { qrCodeUrl: user.qr2fa };
          }
        } else {
          await this.Prisma.user.update({
            where: {
              id_42: User.id,
            },
            data: {
              twoFactorAuth: body.twoFactorAuth,
            },
          });
        }
      }
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Qrcode not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
