import { Module } from '@nestjs/common';
import { SysActionLogService } from './sys-action-log.service';
import { SysActionLogController } from './sys-action-log.controller';

@Module({
controllers: [SysActionLogController],
providers: [SysActionLogService],
})
export class SysActionLogModule {}
