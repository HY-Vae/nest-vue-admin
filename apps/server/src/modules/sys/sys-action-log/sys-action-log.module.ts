import { Module } from '@nestjs/common';
import { SysActionLogController } from './sys-action-log.controller';
import { SysActionLogService } from './sys-action-log.service';

@Module({
  controllers: [SysActionLogController],
  providers: [SysActionLogService],
})
export class SysActionLogModule {}
