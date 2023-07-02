import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { FriendsModule } from './friends/friends.module';
import { SeedModule } from './seed/seed.module';
import { UserGatewayModule } from './usergateway/usergateway.module';
import { NotificationsGateway } from './usergateway/notifications.gateway';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    PrismaModule,
    UsersModule,
    FriendsModule,
    SeedModule,
    UserGatewayModule,
  ],
  providers: [NotificationsGateway],
})
export class AppModule {}
