import { HttpException } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(msg: string, errCode?: number) {
    super(msg, errCode ?? 200);
  }
}
