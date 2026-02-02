import { Module } from '@nestjs/common';
import { TempModule } from '@/modules/tool/temp/temp.module';
import { AutoCodeModule } from '@/modules/tool/auto-code/auto-code.module';

@Module({
  imports: [TempModule, AutoCodeModule],
  controllers: [],
  providers: [],
})
export class ToolModule {}
