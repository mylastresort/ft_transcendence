import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { PriavteChatModule } from './private/privateChat.module';
import { ChatService } from './chat.service';
// import { ChatGateway } from './chat.gateway';

@Module({
    imports: [PriavteChatModule],
    controllers: [ChatController],
    providers: [ChatService]
})
export class ChatModule {}
