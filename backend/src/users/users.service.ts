import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import { S3 } from 'aws-sdk';

@Injectable()
export class UsersService {
  constructor(private Prisma: PrismaService) {}

  async me(user: any) {
    const me = await this.Prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!me) {
      throw new HttpException('User not found', 404);
    } else {
      return me;
    }
  }

  async UploadtoS3(User: any, file: any) {
    try {
      const me = await this.Prisma.user.findUnique({
        where: {
          id: User.id,
        },
      });

      if (!me) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'user not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        const filePath = file.path;
        const fileContent = await fs.readFileSync(filePath);
        const s3 = new S3({
          region: process.env.AWS_S3_REGION,
          signatureVersion: 'v4',
          credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
          },
        });

        const params = {
          Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
          Key: file.filename,
          Body: fileContent,
        };

        // S3 ManagedUpload with callbacks are not supported in AWS SDK for JavaScript (v3).
        // Please convert to `await client.upload(params, options).promise()`, and re-run aws-sdk-js-codemod.
        s3.upload(params, async (err: any, data: any) => {
          if (err) {
            throw new HttpException(err, 500);
          } else {
            const user = await this.Prisma.user.update({
              where: {
                id: User.id,
              },
              data: {
                imgProfile: data.Location,
              },
            });
            fs.unlinkSync(filePath);
            return user;
          }
        });
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfileImg(UserId: number, body: any) {
    try {
      const me = await this.Prisma.user.findUnique({
        where: {
          id: UserId,
        },
      });

      if (!me) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'user not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        const user = await this.Prisma.user.update({
          where: {
            id: UserId,
          },
          data: {
            imgProfile: body.imgProfile,
          },
          select: {
            imgProfile: true,
          },
        });
        return user;
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfile(UserId: number, body: any) {
    try {
      const me = await this.Prisma.user.findUnique({
        where: {
          id: UserId,
        },
      });

      if (!me) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'user not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        const user = await this.Prisma.user.update({
          where: {
            id: UserId,
          },
          data: {
            username: body.username,
            firstName: body.firstName,
            lastName: body.lastName,
            location: body.location,
            sammary: body.sammary,
          },
          select: {
            username: true,
            firstName: true,
            lastName: true,
            location: true,
            sammary: true,
          },
        });
        return user;
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async userProfile(UserId: number, Username: string) {
    try {
      const user = await this.Prisma.user.findUnique({
        where: {
          username: Username,
        },
        select: {
          id: true,
          username: true,
          imgProfile: true,
          firstName: true,
          lastName: true,
          status: true,
          location: true,
          sammary: true,
        },
      });

      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'user not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
