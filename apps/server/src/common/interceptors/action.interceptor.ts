import { ACTION_KEY } from '@/common/constants/decorator.constant';
import { ActionMetaType } from '@/common/types/action.type';
import { CurrentUserType } from '@/common/types/auth.type';
import { getRequestIp, sanitize } from '@/utils/util';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from 'nestjs-prisma';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
    // 获取用户信息 (假设经由 AuthGuard 注入)
    const user = request.user as CurrentUserType;

    // 3. 组装基础日志数据 (请求参数序列化，敏感字段脱敏)
    const reqData = sanitize({ body, query, params: routeParams });
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
      tap({
        next: (data) => {
          this.prisma.sysActionLog
            .create({
              data: {
                ...logBase,
                result: JSON.stringify(data).substring(0, 65000),
                status: '0',
              },
            })
            .catch((e) => {
              this.logger.error('日志存储失败:', e.message);
            });
        },
        error: (err) => {
          this.prisma.sysActionLog
            .create({
              data: {
                ...logBase,
                result: null,
                status: '1',
                errorInfo:
                  err instanceof Error ? err.message : JSON.stringify(err),
              },
            })
            .catch((e) => {
              this.logger.error('错误日志存储失败:', e.message);
            });
        },
      }),
    );
  }
}
