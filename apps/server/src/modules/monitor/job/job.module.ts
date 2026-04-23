import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { JobLogService } from './job-log.service';

@Module({
  controllers: [JobController],
  providers: [JobService, JobLogService],
  exports: [JobService, JobLogService],
})
export class JobModule {}
