import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { updateProfileImg, updateProfile } from './dto/users.dto';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(public service: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async me(@Req() req: any) {
    return this.service.me(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './Uploads',
        filename: (req, file, callback) => {
          const filename = `${Date.now()}${extname(file.originalname)}`;
          return callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@Req() req, @UploadedFile() file) {
    return this.service.UploadtoS3(req.user, file);
  }

  @Post('updateProfileImg')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async updateProfileImg(@Req() req: any, @Body() body: updateProfileImg) {
    return this.service.updateProfileImg(req.user.id, body);
  }

  @Post('updateProfile')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async updateProfile(@Req() req: any, @Body() body: updateProfile) {
    return this.service.updateProfile(req.user.id, body);
  }

  @Post('userProfile')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async userProfile(@Req() req: any, @Body() body: { username: string }) {
    return this.service.userProfile(req.user.id, body.username);
  }
}
