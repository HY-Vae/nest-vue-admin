// src/common/configs/logger.config.ts
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonConfig = {
  transports: [
    // 1. 控制台输出 (开发环境友好)
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('NVA', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
    // 2. 所有的日志文件
    new winston.transports.DailyRotateFile({
      level: 'info',
      dirname: 'logs/combined',
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    // 3. 仅错误日志文件
    new winston.transports.DailyRotateFile({
      level: 'error',
      dirname: 'logs/error',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};
