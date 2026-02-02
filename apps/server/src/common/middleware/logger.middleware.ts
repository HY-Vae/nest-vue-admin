// src/common/middleware/logger.middleware.ts
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, headers } = req;
    const contentType = headers['content-type'] || '';
    const startTime = Date.now();
    let bodyLog = '';

    if (contentType.includes('multipart/form-data')) {
      bodyLog = '[File Upload Content]';
    } else {
      // 只有在常规请求时才尝试解析 body
      const safeBody = { ...req.body };
      if (safeBody.password) safeBody.password = '******';
      bodyLog = JSON.stringify(safeBody);
    }

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      this.logger.log(
        `[${method}] ${originalUrl} ${statusCode} - ${duration}ms | Body: ${JSON.stringify(bodyLog)}`,
      );
    });

    next();
  }
}
