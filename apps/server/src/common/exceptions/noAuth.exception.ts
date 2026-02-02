import { HttpException } from '@nestjs/common';

export class NoAuthException extends HttpException {
  constructor(msg: string = '暂无权限') {
    super(msg, 200);
  }
}
