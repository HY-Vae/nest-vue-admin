import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Result } from '@/common/class/result.class';
import { NoAuthException } from '@/common/exceptions/noAuth.exception';
import { NoPermissionException } from '@/common/exceptions/noPermission.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }
    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof NoAuthException) {
      code = HttpStatus.UNAUTHORIZED;
    } else if (exception instanceof NoPermissionException) {
      code = HttpStatus.FORBIDDEN;
    }
    let message = '';
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      message = (response as any).message ?? response;
    } else if (exception instanceof Error) {
      message = exception.message;
    } else {
      message = `${exception}`;
    }
    this.logger.error(
      `[${request.method}] ${request.url} | Status: ${status} | Error: ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : '',
    );

    const result = Result.error(code, message);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.status(status).json(result);
  }
}
