import { ApiException } from '@/common/exceptions/api.exception';
import { CurrentUserType } from '@/common/types/auth.type';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
  handleRequest<TUser = CurrentUserType>(err: Error | null, user: TUser | false): TUser {
    if (err || !user) {
      throw err || new ApiException('用户名或密码错误');
    }
    return user;
  }
}
