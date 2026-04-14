import { DEV_ONLY_KEY } from '@/common/constants/decorator.constant';
import { ApiException } from '@/common/exceptions/api.exception';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

@Injectable()
export class DevOnlyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isDevOnly = this.reflector.getAllAndOverride<boolean>(DEV_ONLY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isDevOnly) return true;

    const env = this.configService.get<string>('NODE_ENV');
    if (env !== 'development') {
      throw new ApiException('该接口仅在开发环境可用');
    }
    return true;
  }
}
