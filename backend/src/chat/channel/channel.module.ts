import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import ChannelGateway from './channel.gateway';

@Module({
    controllers: [ChannelController],
    providers: [ ChannelService, ChannelGateway ]
})
export class ChannelModule {}