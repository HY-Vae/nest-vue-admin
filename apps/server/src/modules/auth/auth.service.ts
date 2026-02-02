import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

import { REDIS_KEYS } from '@/common/constants/redisKey.constant';
import { ApiException } from '@/common/exceptions/api.exception';
import { CurrentUserType, JwtPayloadType } from '@/common/types/auth.type';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'nestjs-prisma';

import { SUPER_ADMIN } from '@/common/constants/base.constant';
import { EnableStatusEnum } from '@/common/enums/common.enum';
import { NoAuthException } from '@/common/exceptions/noAuth.exception';
import { JwtConfigType } from '@/common/types/config.type';
import { simplifyMenuTree } from '@/utils/menu.util';
import { buildMenuTree, generateRedisKey, generateUUid } from '@/utils/util';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async login(user: CurrentUserType) {
    //   走到这里说明登录成功
    const payload: JwtPayloadType = {
      id: user.id,
    };
    const token = this.jwtService.sign(payload);
    const jwtConfig = this.configService.get<JwtConfigType>('jwt');
    const expiresIn = jwtConfig?.expiresIn || 60 * 60 * 24 * 7 * 1000;
    await this.cacheManager.set(
      generateRedisKey(REDIS_KEYS.USER_TOKEN, user.id),
      token,
      expiresIn,
    );
    const home = await this.getUserHomePage(user);
    return {
      token,
      home,
    };
  }

  async generateCaptcha(captchaId?: string) {
    if (captchaId) {
      await this.cacheManager.del(
        generateRedisKey(REDIS_KEYS.CAPTCHA, captchaId),
      );
    }
    const captcha = svgCaptcha.createMathExpr({
      size: 4, // 验证码长度
      width: 200, // 宽度
      height: 40, // 高度
      noise: 3, // 验证码干扰线数量
      color: true, // 验证码颜色
      ignoreChars: '0o1i', // 验证码中排除的 字符集合
      background: '#eee', // 验证码背景颜色
    });
    const id = generateUUid();
    const key = generateRedisKey(REDIS_KEYS.CAPTCHA, id);
    await this.cacheManager.set(key, captcha.text);
    return { id, img: captcha.data.toString() };
  }

  async checkCaptcha(captchaId: string, text?: string) {
    const key = generateRedisKey(REDIS_KEYS.CAPTCHA, captchaId);
    const captcha = await this.cacheManager.get<string>(key);
    if (!captcha || text?.toLowerCase() !== captcha.toLowerCase()) {
      throw new ApiException('验证码错误');
    }
    await this.cacheManager.del(key);
  }

  async validateUser(userName: string, password: string) {
    const user = await this.prisma.sysUser.findFirst({
      where: {
        userName,
        status: EnableStatusEnum.ENABLE,
      },
    });
    if (!user) {
      throw new ApiException('用户不存在');
    }
    const isok = await bcrypt.compare(password, user.password);
    if (!isok) {
      throw new ApiException('密码错误');
    }
    return await this.getCurrentUser(user.id);
  }

  async validateToken(id: string, token: string) {
    const cacheToken = await this.cacheManager.get<string>(
      generateRedisKey(REDIS_KEYS.USER_TOKEN, id),
    );
    if (cacheToken !== token) throw new NoAuthException('登录状态已过期');
    //   从缓存中获取用户信息
    return await this.getCurrentUser(id);
  }

  async getRoleIds(userId: string) {
    const roles = await this.prisma.sysRole.findMany({
      where: {
        status: EnableStatusEnum.ENABLE,
        users: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
      },
    });
    return roles.map((item) => item.id);
  }

  async getPermissions(roleIds: string[]) {
    const menus = await this.prisma.sysMenu.findMany({
      select: {
        auth: true,
      },
      where: {
        status: EnableStatusEnum.ENABLE,
        roles: {
          some: {
            status: EnableStatusEnum.ENABLE,
            id: {
              in: roleIds,
            },
          },
        },
      },
    });
    const btns = await this.prisma.sysMenuBtn.findMany({
      select: {
        auth: true,
      },
      where: {
        roles: {
          some: {
            status: EnableStatusEnum.ENABLE,
            id: {
              in: roleIds,
            },
          },
        },
      },
    });
    return [...menus, ...btns].map((item) => item.auth);
  }
  async getRoutes(user: CurrentUserType) {
    const where: Prisma.SysMenuWhereInput = {
      status: EnableStatusEnum.ENABLE,
    };
    if (!user.isSuper) {
      where.auth = {
        in: user.permissions,
      };
    }
    const menus = await this.prisma.sysMenu.findMany({
      where,
      include: {
        meta: true,
      },
    });
    return buildMenuTree(menus, undefined);
  }

  getFirstPage(routes: any[]) {
    if (!routes.length) {
      return null;
    }
    const route = routes[0];
    if (route.children.length) {
      return this.getFirstPage(route.children);
    }
    return route;
  }

  async getUserHomePage(user: CurrentUserType) {
    const routes = await this.getRoutes(user);
    return this.getFirstPage(routes)?.path;
  }

  async getAllPermissions() {
    const where: Prisma.SysMenuWhereInput = {
      status: EnableStatusEnum.ENABLE,
    };
    const menusP = this.prisma.sysMenu.findMany({
      where,
      include: {
        meta: true,
      },
    });
    const apisP = this.prisma.sysMenu.findMany({
      where: {
        menuBtns: {
          some: {},
        },
      },
      select: {
        id: true,
        meta: {
          select: {
            title: true,
          },
        },
        menuBtns: true,
      },
      orderBy: {
        sort: 'asc',
      },
    });
    const [menus, apis] = await Promise.all([menusP, apisP]);
    const apiTree = apis.map((item) => {
      return {
        label: item.meta?.title || '',
        value: item.id,
        children: item.menuBtns.map((btn) => ({
          label: btn.name,
          value: btn.id,
        })),
      };
    });
    const menuTreeList = buildMenuTree(menus, undefined);
    const menuTree = simplifyMenuTree(menuTreeList);
    return {
      menuTree,
      apiTree,
    };
  }

  async findOne(id: string): Promise<CurrentUserType> {
    const user = await this.prisma.sysUser.findFirst({
      where: {
        id: id,
      },
    });
    if (!user) throw new ApiException('用户不存在');
    // 获取菜单、获取按钮权限
    const roleIds = await this.getRoleIds(id);
    let isSuper = false;
    let permissions: string[] = [];
    if (user.userName === 'admin') {
      permissions = [SUPER_ADMIN];
      isSuper = true;
    } else {
      permissions = await this.getPermissions(roleIds);
    }
    const currentUser: CurrentUserType = {
      ...user,
      isSuper,
      permissions,
    };
    await this.cacheManager.set(
      generateRedisKey(REDIS_KEYS.USER_INFO, id),
      currentUser,
    );
    return currentUser;
  }

  async getCurrentUser(userId: string, fromDb: boolean = false) {
    if (fromDb) {
      return await this.findOne(userId);
    }
    let user = await this.cacheManager.get<CurrentUserType>(
      generateRedisKey(REDIS_KEYS.USER_INFO, userId),
    );
    if (!user) {
      user = await this.findOne(userId);
    }
    return user;
  }
}
