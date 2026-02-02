import { UploadModeEnum } from '@/common/enums/config.enum';
import { winstonConfig } from '@/common/logger/logger';
import { FileUploadType } from '@/common/types/config.type';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { WinstonModule } from 'nest-winston';
import path, { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  const configService = app.get(ConfigService);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('NVA')
    .setDescription('nest-vue-admin接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('document', app, documentFactory, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });
  const port = configService.get('port');
  // 注册本地静态资源目录
  const uploadConfig = configService.get<FileUploadType>('upload');
  if (uploadConfig?.mode === UploadModeEnum.LOCAL) {
    const localConfig = uploadConfig[UploadModeEnum.LOCAL];
    // 判断是否是相对路径
    let assetPath = localConfig.folder;
    if (!path.isAbsolute(localConfig.folder)) {
      assetPath = join(__dirname, '..', localConfig.folder);
    }
    app.useStaticAssets(assetPath, {
      prefix: localConfig.prefix,
    });
  }

  await app.listen(port);
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('123456', salt);
  console.log(password);
  console.log(`服务启动成功，端口：http://127.0.0.1:${port}`);
  console.log(`文档地址：http://127.0.0.1:3333/document`);
}
bootstrap();
