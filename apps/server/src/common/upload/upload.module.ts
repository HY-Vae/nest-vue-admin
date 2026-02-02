import { Module } from '@nestjs/common';
import { UploadCommonService } from '@/common/upload/upload.service';

@Module({
  imports: [],
  providers: [UploadCommonService],
  exports: [UploadCommonService],
})
export class UploadCommonModule {}
