import { HttpException } from '@nestjs/common';

export class NoPermissionException extends HttpException {
  constructor(msg: string = '暂无权限') {
    super(msg, 200);
  }
}
