import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { PriavteChatModule } from './private/privateChat.module';
import { ChannelModule } from './channel/channel.module';
import { ChatService } from './chat.service';

@Module({
    imports: [PriavteChatModule, ChannelModule],
    controllers: [ChatController],
    providers: [ChatService]
})
export class ChatModule {}
