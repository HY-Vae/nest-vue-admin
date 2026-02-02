import { AuthModule } from '@/modules/auth/auth.module';
import { SysModule } from '@/modules/sys/sys.module';
import { ToolModule } from '@/modules/tool/tool.module';
import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [SysModule, AuthModule, ToolModule, UploadModule],
})
export class ModulesModule {}
