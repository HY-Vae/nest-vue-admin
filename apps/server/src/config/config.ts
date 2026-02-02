import { CacheModeEnum, UploadModeEnum } from '@/common/enums/config.enum';
import { ConfigType } from '@/common/types/config.type';

const config: ConfigType = {
  port: 3333,
  jwt: {
    secret: 'This system is nest-vue-admin',
    expiresIn: 60 * 60 * 24 * 7 * 1000,
  },
  cache: {
    mode: CacheModeEnum.REDIS,
    ttl: 60000,
  },
  /**
   * reids 配置
   */
  redis: {
    host: '127.0.0.1',
    port: 6379,
    username: '',
    password: '',
    database: 6,
  },
  captcha: {
    size: 4,
    width: 100,
    height: 40,
  },
  genCode: {
    serverFolder: 'src',
    mainModuleName: 'app.module.ts',
  },
  upload: {
    maxFileSize: 1024 * 1024 * 10,
    mode: UploadModeEnum.LOCAL,
    [UploadModeEnum.LOCAL]: {
      folder: 'uploads',
      prefix: '/uploads',
      baseUrl: 'http://127.0.0.1:3333',
    },
    [UploadModeEnum.ALIYUN]: {
      region: '',
      accessKeyId: '',
      accessKeySecret: '',
      bucket: '',
      folder: '',
      baseUrl: '',
    },
  },
};

export const getConfig = () => config;
