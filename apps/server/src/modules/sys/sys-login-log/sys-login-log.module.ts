import { Module } from '@nestjs/common';
import { SysLoginLogController } from './sys-login-log.controller';
import { SysLoginLogService } from './sys-login-log.service';

@Module({
  controllers: [SysLoginLogController],
  providers: [SysLoginLogService],
  exports: [SysLoginLogService],
})
export class SysLoginLogModule {}
