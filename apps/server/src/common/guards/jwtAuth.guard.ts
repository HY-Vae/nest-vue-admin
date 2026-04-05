import { PUBLIC_KEY } from '@/common/constants/decorator.constant';
import { NoAuthException } from '@/common/exceptions/noAuth.exception';
import { CurrentUserType } from '@/common/types/auth.type';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }

  handleRequest<TUser = CurrentUserType>(
    err: Error | null,
    user: TUser | false,
    info: unknown,
  ): TUser {
    if (err || !user) {
      throw err || new NoAuthException('登录状态已过期');
    }
    return user;
  }
}
