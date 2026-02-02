import { GenService } from '@/modules/tool/gen/gen.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [GenService],
  exports: [GenService],
})
export class GenModule {}
