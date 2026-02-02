import { Module } from '@nestjs/common';
import { SysModule } from '@/modules/sys/sys.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ToolModule } from '@/modules/tool/tool.module';
import { UploadModule } from "./upload/upload.module";

@Module({
  imports: [SysModule, AuthModule, ToolModule, UploadModule],
})
export class ModulesModule {}
