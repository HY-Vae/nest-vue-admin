import { ApiException } from '@/common/exceptions/api.exception';
import { CurrentUserType } from '@/common/types/auth.type';
import { SysLoginLogService } from '@/modules/sys/sys-login-log/sys-login-log.service';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { from, lastValueFrom, of } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly loginLogService: SysLoginLogService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const result = super.canActivate(context);
      // 处理 boolean | Promise<boolean> | Observable<boolean> 三种情况
      const observableResult =
        typeof result === 'boolean'
          ? of(result)
          : result instanceof Promise
            ? from(result)
            : result;

      const canActivate = await lastValueFrom(observableResult);
      // 登录成功，记录日志
      const user = request.user as CurrentUserType;
      this.loginLogService.recordSuccess(request, user.id).catch(() => {});
      return canActivate;
    } catch (error: unknown) {
      // 登录失败，记录日志
      const message = error instanceof Error ? error.message : '登录失败';
      this.loginLogService.recordFailure(request, message).catch(() => {});
      throw error;
    }
  }

  handleRequest<TUser = CurrentUserType>(
    err: Error | null,
    user: TUser | false,
  ): TUser {
    if (err || !user) {
      throw err || new ApiException('用户名或密码错误');
    }
    return user;
  }
}
