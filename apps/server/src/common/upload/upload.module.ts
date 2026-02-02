import { UploadCommonService } from '@/common/upload/upload.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [UploadCommonService],
  exports: [UploadCommonService],
})
export class UploadCommonModule {}
