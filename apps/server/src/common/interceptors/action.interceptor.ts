import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { PrismaService } from 'nestjs-prisma';
import { ActionMetaType } from '@/common/types/action.type';
import { ACTION_KEY } from '@/common/constants/decorator.constant';
import { Request } from 'express';
import { getRequestIp } from '@/utils/util';
import { CurrentUserType } from '@/common/types/auth.type';

@Injectable()
export class ActionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ActionInterceptor.name);

  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 1. 获取装饰器元数据
    const auditOptions = this.reflector.get<ActionMetaType>(
      ACTION_KEY,
      context.getHandler(),
    );
    if (!auditOptions) return next.handle();

    // 2. 获取请求上下文
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, originalUrl, body, query, params: routeParams } = request;
    debugger;
    // 获取用户信息 (假设经由 AuthGuard 注入)
    const user = request.user as CurrentUserType;

    // 3. 组装基础日志数据 (请求参数序列化)
    // 建议：合并 body, query, params 以便完整记录，同时注意脱敏密码等敏感字段
    const reqData = { body, query, params: routeParams };
    const paramsJson = JSON.stringify(reqData);

    // 获取真实 IP (处理 Nginx 代理情况)
    const realIp = getRequestIp(request);

    const logBase = {
      title: auditOptions.title, // 映射：module -> title
      action: auditOptions.action, // 注意：Schema中action长度仅为2，需确保传入值简短
      method: method,
      ip: realIp,
      address: originalUrl, // 映射：url -> address
      userId: user?.id ? String(user.id) : null, // 强制转 String
      userName: user?.nickName || null,
      params: paramsJson,
    };

    return next.handle().pipe(
      // A. 处理成功情况
      tap({
        next: (data) => {
          console.log('end');
          this.prisma.sysActionLog
            .create({
              data: {
                ...logBase,
                result: JSON.stringify(data).substring(0, 65000),
                status: '0',
              },
            })
            .catch((e) => {
              console.error('日志存储失败:', e.message);
            });
        },
        error: (err) => {
          this.prisma.sysActionLog.create({
            data: {
              ...logBase,
              result: null,
              status: '1', // 假设 '0' 代表失败
              errorInfo:
                err instanceof Error ? err.message : JSON.stringify(err),
            },
          });
        },
      }),
    );
  }
}
