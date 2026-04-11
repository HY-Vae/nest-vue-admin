import { CommonResultType } from '../types/common.type';

export class Result {
  static success<T>(
    data: T,
    message: string = '操作成功',
  ): CommonResultType<T> {
    return {
      code: 200,
      data,
      message,
    };
  }
  static error(code: number, message: string = '操作失败'): CommonResultType {
    return {
      code,
      message,
      data: null,
    };
  }
}
