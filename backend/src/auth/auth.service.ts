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

  async register(User: any): Promise<any> {
    const user = await this.Prisma.user.findUnique({
      where: {
        id_42: User.id,
      },
    });

    if (user) {
      if (user.twoFactorAuth) {
        const token = await this.JwtService.signAsync(
          {
            id: user.id,
            username: user.username,
            id_42: user.id_42,
          },
          {
            secret: process.env.TMP_JWT_SECRET,
            expiresIn: process.env.TMP_JWT_TOKEN_EXPIRES_IN,
          },
        );
        return {
          token,
          twoFactorAuth: user.twoFactorAuth,
        };
      } else {
        const token = await this.JwtService.sign({
          id: user.id,
          username: user.username,
          id_42: user.id_42,
        });
        return {
          user,
          token,
        };
      }
    }
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
        const token = await this.JwtService.sign({
          id: newUser.id,
          username: newUser.username,
          id_42: newUser.id_42,
        });
        return {
          newUser,
          token,
        };
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
    const secret = await speakeasy.generateSecret({
      name: 'Your App Name',
    });

    console.log(secret);

    return new Promise<{ url: string; secret: string }>((resolve, reject) => {
      qrcode.toDataURL(secret.otpauth_url, (error: any, url: string) => {
        if (error) {
          reject(error);
        } else {
          resolve({ url, secret: secret.ascii });
        }
      });
    });
  }

  async GettwoFactorAuth(User: any, body: any): Promise<any> {
    const user = await this.Prisma.user.findUnique({
      where: {
        id: User.id,
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
      if (body.twoFactorAuth) {
        if (!user.qr2fa) {
          const generated2FA = await this.generateQRCode();
          await this.Prisma.user.update({
            where: {
              id: User.id,
            },
            data: {
              twoFactorAuth: body.twoFactorAuth,
              qr2fa: generated2FA.url,
              twoFactorAuthSecret: generated2FA.secret,
            },
          });
          return { qrCodeUrl: generated2FA.url };
        } else {
          await this.Prisma.user.update({
            where: {
              id: User.id,
            },
            data: {
              twoFactorAuth: body.twoFactorAuth,
            },
          });
          return { qrCodeUrl: user.qr2fa };
        }
      } else {
        await this.Prisma.user.update({
          where: {
            id: User.id,
          },
          data: {
            twoFactorAuth: body.twoFactorAuth,
          },
        });
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

  async VerifytwoFactorAuth(User: any, body: any): Promise<any> {
    const code = body.code;

    const user = await this.Prisma.user.findUnique({
      where: {
        id: User.id,
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

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorAuthSecret,
      encoding: 'ascii',
      token: code,
    });

    console.log(verified);
    70616;
    if (verified) {
      const token = await this.JwtService.sign({
        id: user.id,
        username: user.username,
        id_42: user.id_42,
      });
      return {
        user,
        token,
      };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Code is not valid',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
