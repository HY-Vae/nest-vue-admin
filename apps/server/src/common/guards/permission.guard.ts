import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../constants/decorator.constant';
import { SUPER_ADMIN } from '../constants/base.constant';
import { NoAuthException } from '@/common/exceptions/noAuth.exception';
import { NoPermissionException } from '@/common/exceptions/noPermission.exception';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permission = this.reflector.getAllAndOverride(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!permission) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const permissions: string[] = user?.permissions || [];
    if (permissions.includes(SUPER_ADMIN)) return true;
    const isok = permissions.includes(permission);
    if (!isok) {
      throw new NoPermissionException('权限不足');
    }
    return isok;
  }
}
