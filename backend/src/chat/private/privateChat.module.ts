import { Module } from '@nestjs/common';
import { PriavteChatController } from './privateChat.controller';
import { PrivateChatService } from './privateChat.service';
import {PrivateChatGatway} from './privateChat.gateway'


@Module({
    controllers: [PriavteChatController],
    providers: [ PrivateChatService, PrivateChatGatway]
})
export class PriavteChatModule {}