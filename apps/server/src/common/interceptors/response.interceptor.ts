import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result } from '../class/result.class';
import { CommonResultType } from '../types/common.type';
import { Reflector } from '@nestjs/core';
import { ORIGINAL_KEY } from '@/common/constants/decorator.constant';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, CommonResultType>
{
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CommonResultType> {
    return next.handle().pipe(
      map((data) => {
        const keep = this.reflector.getAllAndOverride<boolean>(ORIGINAL_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (keep) return data;

        // 对转换的数据进行处理
        const res = context.switchToHttp().getResponse();
        res.header('Content-Type', 'application/json; charset=utf-8');
        return Result.success(data);
      }),
    );
  }
}
