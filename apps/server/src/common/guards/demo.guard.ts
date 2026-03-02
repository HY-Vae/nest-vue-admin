import { ApiException } from '@/common/exceptions/api.exception';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DemoEnvironmentGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. 获取配置 (注意：根据你的 config 结构，可能需要 'true' 字符串判断)
    const isDemo = this.configService.get<boolean>('isDemo') || false;

    // 如果不是演示环境，直接放行
    if (!isDemo || String(isDemo) !== 'true') {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // 2. 定义白名单 (不需要拦截的接口，比如登录、退出、获取验证码)
    const whitelist = ['/auth/login', '/auth/logout'];

    // 如果请求路径在白名单内，放行
    // 使用 includes 判断，或者 startsWith 判断前缀
    if (whitelist.some((url) => request.url.includes(url))) {
      return true;
    }

    // 3. 拦截写操作
    // GET 请求通常是安全的（只读），其他方法（POST, PUT, DELETE, PATCH）禁止
    if (request.method !== 'GET') {
      throw new ApiException('演示环境，禁止执行修改操作！');
    }

    return true;
  }
}
