import { Module } from '@nestjs/common';
import { SysDictDetailService } from './sys-dict-detail.service';
import { SysDictDetailController } from './sys-dict-detail.controller';

@Module({
  controllers: [SysDictDetailController],
  providers: [SysDictDetailService],
})
export class SysDictDetailModule {}
