import { Module } from '@nestjs/common';
import { SysDeptService } from './sys-dept.service';
import { SysDeptController } from './sys-dept.controller';

@Module({
controllers: [SysDeptController],
providers: [SysDeptService],
})
export class SysDeptModule {}
