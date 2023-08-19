import { Module } from '@nestjs/common';
import { PriavteChatController } from './privateChat.controller';
import { PrivateChatService } from './privateChat.service';
import {PrivateChatGatway} from './privateChat.gateway'
import { ChatService } from '../chat.service';


@Module({
    controllers: [PriavteChatController],
    providers: [ PrivateChatService, PrivateChatGatway, ChatService]
})
export class PriavteChatModule {}