import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { PriavteChatModule } from './private/privateChat.module';
import { ChannelModule } from './channel/channel.module';
import { ChatService } from './chat.service';
import ChatGateway from './chat.gateway';
import { PrivateChatService } from './private/privateChat.service';
import { ChannelService } from './channel/channel.service';

@Module({
    imports: [PriavteChatModule, ChannelModule],
    controllers: [ChatController],
    providers: [ChatService, ChatGateway],
})
export class ChatModule {}
