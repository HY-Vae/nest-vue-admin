import { ConfigObject } from 'svg-captcha';
import { CacheModeEnum, UploadModeEnum } from '@/common/enums/config.enum';

export type RedisConfigType = {
  host: string;
  port: number;
  username?: string;
  password?: string;
  database: number;
};

export type CacheConfigType = {
  mode: CacheModeEnum;
  ttl: number;
};

export type JwtConfigType = {
  expiresIn: number;
  secret: string;
};
export type GenCodeType = {
  serverFolder: string;
  mainModuleName: string;
};

export type ConfigType = {
  port: number;
  jwt: JwtConfigType;
  cache: CacheConfigType;
  redis: RedisConfigType;
  captcha: ConfigObject;
  genCode: GenCodeType;
  upload: FileUploadType;
};

export interface LocalFileConfig {
  folder: string;
  baseUrl: string;
  prefix: string;
}

export interface AliyunConfig {
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  folder: string;
  baseUrl: string;
}

export type FileUploadType = {
  maxFileSize: number;
  mode: UploadModeEnum;
  [UploadModeEnum.LOCAL]: LocalFileConfig;
  [UploadModeEnum.ALIYUN]: AliyunConfig;
};
