import { Module } from '@nestjs/common';
import { SysMessageController } from './sys-message.controller';
import { SysMessageService } from './sys-message.service';

@Module({
  controllers: [SysMessageController],
  providers: [SysMessageService],
  exports: [SysMessageService],
})
export class SysMessageModule {}
