import { Module } from '@nestjs/common';
import { SysTodoController } from './sys-todo.controller';
import { SysTodoService } from './sys-todo.service';

@Module({
  controllers: [SysTodoController],
  providers: [SysTodoService],
  exports: [SysTodoService],
})
export class SysTodoModule {}
