import { AutoCodeModule } from '@/modules/tool/auto-code/auto-code.module';
import { TempModule } from '@/modules/tool/temp/temp.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TempModule, AutoCodeModule],
  controllers: [],
  providers: [],
})
export class ToolModule {}
