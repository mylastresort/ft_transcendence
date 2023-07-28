import { Module } from '@nestjs/common';
import { PriavteChatController } from './privateChat.controller';
import { PrivateChatService } from './privateChat.service';
import PriavteChatGateway from './privateChat.gateway';
// import { ChatGateway } from './chat.gateway';

@Module({
    controllers: [PriavteChatController],
    providers: [ PrivateChatService, PriavteChatGateway ]
})
export class PriavteChatModule {}