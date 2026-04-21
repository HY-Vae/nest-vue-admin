import { Module } from '@nestjs/common';
import { SysDictDetailController } from './sys-dict-detail.controller';
import { SysDictDetailService } from './sys-dict-detail.service';

@Module({
  controllers: [SysDictDetailController],
  providers: [SysDictDetailService],
})
export class SysDictDetailModule {}
