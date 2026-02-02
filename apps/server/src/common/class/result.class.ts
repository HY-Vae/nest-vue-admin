import { CommonResultType } from '../types/common.type';

export class Result {
  static success(data: any, message: string = '操作成功'): CommonResultType {
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
