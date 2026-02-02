import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { SysModule } from '@/modules/sys/sys.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ToolModule } from '@/modules/tool/tool.module';
import { ModulesModule } from './modules/modules.module';
import { LoggerMiddleware } from '@/common/middleware/logger.middleware';

@Module({
  imports: [CommonModule, ModulesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
