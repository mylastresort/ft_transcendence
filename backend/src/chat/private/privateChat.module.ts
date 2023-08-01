import { Module } from '@nestjs/common';
import { PriavteChatController } from './privateChat.controller';
import { PrivateChatService } from './privateChat.service';


@Module({
    controllers: [PriavteChatController],
    providers: [ PrivateChatService]
})
export class PriavteChatModule {}