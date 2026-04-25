import { ApiException } from '@/common/exceptions/api.exception';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DemoEnvironmentGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const isDemo = this.configService.get<boolean>('isDemo') || false;

    if (!isDemo || String(isDemo) !== 'true') {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { url, method } = request;

    // GET 请求全部放行
    if (method === 'GET') {
      return true;
    }

    // 白名单接口放行（登录、退出）
    const whitelist = ['/auth/login', '/auth/logout'];
    if (whitelist.some((w) => url.includes(w))) {
      return true;
    }

    // 禁止删除管理员账号 (id=1)
    if (method === 'DELETE' && /\/sys\/user\/1([/?]|$)/.test(url)) {
      throw new ApiException('演示环境，禁止删除管理员账号！');
    }

    // 禁止修改管理员账号信息
    if (method === 'PATCH' && /\/sys\/user\/1([/?]|$)/.test(url)) {
      throw new ApiException('演示环境，禁止修改管理员账号！');
    }

    // 禁止修改密码（防止改掉 demo 账号密码后其他人无法登录）
    if (method === 'PATCH' && url.includes('/sys/user/password')) {
      throw new ApiException('演示环境，禁止修改密码！');
    }

    // 禁止删除和修改菜单（菜单是系统骨架，被破坏后 demo 无法使用）
    if (url.includes('/sys/menu') && method !== 'GET') {
      throw new ApiException('演示环境，禁止修改或删除菜单！');
    }

    // 其他写操作（POST/PUT/PATCH/DELETE）全部放行
    // 删除角色、部门等操作已有 Service 层的业务保护：
    // - 不可删除超管角色、不可删除已分配用户的角色
    // - 不可删除有子部门的部门
    // - 不可删除有角色分配的用户
    return true;
  }
}
