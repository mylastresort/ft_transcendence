import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { FriendsModule } from './friends/friends.module';
import { SeedModule } from './seed/seed.module';
import { UserGatewayModule } from './usergateway/usergateway.module';
import { NotificationsGateway } from './usergateway/notifications.gateway';
import { GameModule } from './game/game.module';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    PrismaModule,
    UsersModule,
    FriendsModule,
    SeedModule,
    UserGatewayModule,
    GameModule,
    ChatModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
})
export class AppModule {}
