import { Module } from '@nestjs/common';
import { GenService } from '@/modules/tool/gen/gen.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GenService],
  exports: [GenService],
})
export class GenModule {}
