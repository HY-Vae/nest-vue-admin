import { REDIS_KEYS } from '@/common/constants/redisKey.constant';
import { EnableStatusEnum } from '@/common/enums/common.enum';
import { ApiException } from '@/common/exceptions/api.exception';
import { generateRedisKey, generateUUid } from '@/utils/util';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateSysRoleDto,
  GetSysRoleListDto,
  UpdateSysRoleDto,
} from './dto/req-sys-role.dto';

@Injectable()
export class SysRoleService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create(createSysRoleDto: CreateSysRoleDto) {
    const exist = await this.prisma.sysRole.findFirst({
      where: {
        key: createSysRoleDto.key,
      },
    });
    if (exist) {
      throw new ApiException('角色值已存在');
    }
    const { menus, menuBtns, ...others } = createSysRoleDto;
    return this.prisma.sysRole.create({
      data: {
        ...others,
        id: generateUUid(),
        menus: {
          connect: createSysRoleDto.menus.map((id) => ({ id })),
        },
        menuBtns: {
          connect: createSysRoleDto.menuBtns.map((id) => ({ id })),
        },
      },
    });
  }

  async findAll(query: GetSysRoleListDto) {
    const { skip, take } = query;
    const where: Prisma.SysRoleWhereInput = {};
    if (query.name) {
      where.name = {
        contains: query.name,
      };
    }
    if (query.status) {
      where.status = query.status;
    }
    const listPromise = this.prisma.sysRole.findMany({
      where,
      skip,
      take,
    });
    const totalPromise = this.prisma.sysRole.count({
      where,
    });
    const [list, total] = await Promise.all([listPromise, totalPromise]);
    return {
      list,
      total,
    };
  }

  async findAllOptions() {
    const roles = await this.prisma.sysRole.findMany({
      where: {
        status: EnableStatusEnum.ENABLE,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return roles.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.sysRole.findUnique({
      where: {
        id,
      },
      include: {
        menus: {
          select: {
            id: true,
          },
        },
        menuBtns: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!role) {
      return null;
    }
    const menus = role.menus.map((menu) => menu.id);
    const menuBtns = role.menuBtns.map((menuBtn) => menuBtn.id);
    return {
      ...role,
      menus,
      menuBtns,
    };
  }

  async removeCache(roleId: string) {
    const userIds = await this.prisma.sysUser.findMany({
      where: {
        roles: {
          some: {
            id: roleId,
          },
        },
      },
      select: {
        id: true,
      },
    });
    for (let i = 0; i < userIds.length; i++) {
      await this.cacheManager.del(
        generateRedisKey(REDIS_KEYS.USER_INFO, userIds[i].id),
      );
    }
  }

  async update(id: string, updateSysRoleDto: UpdateSysRoleDto) {
    const exist = await this.prisma.sysRole.findFirst({
      where: {
        key: updateSysRoleDto.key,
        id: {
          not: id,
        },
      },
    });
    if (exist) {
      throw new ApiException('角色值已存在');
    }
    const { menus, menuBtns, ...others } = updateSysRoleDto;
    await this.removeCache(id);
    return this.prisma.sysRole.update({
      where: {
        id,
      },
      data: {
        ...others,
        menus: {
          set: menus?.map((id) => ({ id })),
        },
        menuBtns: {
          set: menuBtns?.map((id) => ({ id })),
        },
      },
    });
  }

  async remove(id: string) {
    // 先查询这个角色下是否有用户;
    if (!id) {
      throw new ApiException('参数异常');
    }
    const user = await this.prisma.sysUser.findFirst({
      where: {
        roles: {
          some: {
            id,
          },
        },
      },
    });
    if (user) {
      throw new Error('该角色下有用户，请先解除用户角色分配');
    }
    await this.removeCache(id);
    await this.prisma.sysRole.delete({
      where: {
        id,
      },
    });
  }
}
