import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/token.type';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private Prisma: PrismaService, private JwtService: JwtService) {}

  async hash(value: string) {
    return bcrypt.hash(value, 10);
  }

  async register(code: string) {
    try {
      const response = await axios.post('https://api.intra.42.fr/oauth/token', {
        grant_type: 'authorization_code',
        client_id: process.env.FORTYTWO_CLIENT_ID,
        client_secret: process.env.FORTYTWO_CLIENT_SECRET,
        code: code,
        redirect_uri: `${process.env.FRONTEND_DOMAIN}/login`,
      });

      const token = response.data.access_token;

      const res = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const User = res.data;

      if (res.status === 200) {
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
      } else {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async me(Userid: number) {
    try {
      const user = await this.Prisma.user.findUnique({
        where: {
          id: Userid,
        },
        select: {
          id: true,
          imgProfile: true,
          username: true,
          firstName: true,
          lastName: true,
          location: true,
          sammary: true,
          twoFactorAuth: true,
          verified2FA: true,
          isFirstTime: true,
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

      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateQRCode() {
    const secret = speakeasy.generateSecret({ length: 20 });
    const qrCode = await qrcode.toDataURL(secret.otpauth_url);
    return { secret: secret.base32, qrCode };
  }

  async GettwoFactorAuth(User: any, body: any) {
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
              qr2fa: generated2FA.qrCode,
              twoFactorAuthSecret: generated2FA.secret,
            },
          });
          return { qrCodeUrl: generated2FA.qrCode };
        } else {
          return { qrCodeUrl: user.qr2fa };
        }
      } else {
        await this.Prisma.user.update({
          where: {
            id: User.id,
          },
          data: {
            twoFactorAuth: false,
            verified2FA: false,
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

  async verify2FACode(user: any, code: string) {
    const verified = await speakeasy.totp.verify({
      secret: user.twoFactorAuthSecret,
      encoding: 'base32',
      token: code,
      window: 6,
    });
    return verified;
  }

  async VerifytwoFactorAuth(User: any, body: any) {
    const code = body.code;
    const login = body.login;

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

    const verified = await this.verify2FACode(user, code);

    if (verified && !login) {
      const token = await this.JwtService.sign({
        id: user.id,
        username: user.username,
        id_42: user.id_42,
      });
      return {
        user,
        token,
      };
    } else if (verified && login) {
      await this.Prisma.user.update({
        where: {
          id: User.id,
        },
        data: {
          twoFactorAuth: true,
          verified2FA: true,
        },
      });
      return {
        twoFactorAuth: true,
        verified2FA: true,
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
