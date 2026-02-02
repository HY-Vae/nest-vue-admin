import { Module } from '@nestjs/common';
import { TempService } from './temp.service';
import { TempController } from './temp.controller';
import { GenModule } from '@/modules/tool/gen/gen.module';

@Module({
  imports: [GenModule],
  controllers: [TempController],
  providers: [TempService],
})
export class TempModule {}
