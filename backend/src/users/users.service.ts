import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
const fs = require('fs');
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
    const me = await this.Prisma.user.findUnique({
      where: {
        id: User.id,
      },
    });

    if (!me) {
      throw new HttpException('User not found', 404);
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
  }

  async updateProfile(User: any, body: any) {
    const username = body.username;
    const me = await this.Prisma.user.findUnique({
      where: {
        id: User.id,
      },
    });

    if (!me) {
      throw new HttpException('User not found', 404);
    } else {
      const user = await this.Prisma.user.update({
        where: {
          id: User.id,
        },
        data: {
          username: username,
        },
      });
      return user;
    }
  }
}
