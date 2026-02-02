import { GenModule } from '@/modules/tool/gen/gen.module';
import { Module } from '@nestjs/common';
import { TempController } from './temp.controller';
import { TempService } from './temp.service';

@Module({
  imports: [GenModule],
  controllers: [TempController],
  providers: [TempService],
})
export class TempModule {}
