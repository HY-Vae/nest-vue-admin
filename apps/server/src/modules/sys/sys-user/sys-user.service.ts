import { REDIS_KEYS } from '@/common/constants/redisKey.constant';
import { ApiException } from '@/common/exceptions/api.exception';
import { generateRedisKey, generateUUid } from '@/utils/util';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateSysUserDto,
  GetSysUserListDto,
  UpdateSysUserDto,
} from './dto/req-sys-user.dto';

@Injectable()
export class SysUserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async create(createSysUserDto: CreateSysUserDto) {
    const user = await this.prisma.sysUser.findFirst({
      where: {
        userName: createSysUserDto.userName,
      },
    });
    if (user) {
      throw new ApiException('用户名已存在');
    }
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('123456', salt);
    const { roleIds, ...other } = createSysUserDto;
    return this.prisma.sysUser.create({
      data: {
        ...other,
        id: generateUUid(),
        password,
        roles: {
          connect: roleIds.map((id) => ({ id })),
        },
      },
      omit: {
        password: true,
      },
    });
  }

  async findAll(query: GetSysUserListDto) {
    const { skip, take } = query;
    const where: Prisma.SysUserWhereInput = {};
    if (query.userName) {
      where.userName = {
        contains: query.userName,
      };
    }
    if (query.phone) {
      where.phone = {
        contains: query.phone,
      };
    }
    if (query.status) {
      where.status = query.status;
    }

    const listPromise = this.prisma.sysUser.findMany({
      where,
      skip,
      take,
      omit: {
        password: true,
      },
    });
    const totalPromise = this.prisma.sysUser.count({
      where,
    });
    const [list, total] = await Promise.all([listPromise, totalPromise]);
    return {
      list,
      total,
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.sysUser.findUnique({
      where: {
        id,
      },
      include: {
        roles: true,
      },
      omit: {
        password: true,
      },
    });
    if (!user) {
      return null;
    }
    const { roles, ...other } = user;
    const roleIds = roles.map((role) => role.id);
    return {
      ...other,
      roleIds,
    };
  }

  async update(id: string, updateSysUserDto: UpdateSysUserDto) {
    const { roleIds, ...other } = updateSysUserDto;
    const exist = await this.prisma.sysUser.findFirst({
      where: {
        userName: updateSysUserDto.userName,
        id: {
          not: id,
        },
      },
    });
    if (exist) {
      throw new ApiException('用户名已存在');
    }
    const user = await this.prisma.sysUser.update({
      where: {
        id,
      },
      data: {
        ...other,
        roles: {
          set: roleIds?.map((id) => ({ id })),
        },
      },
      omit: {
        password: true,
      },
    });
    await this.cacheManager.del(generateRedisKey(REDIS_KEYS.USER_INFO, id));
    return user;
  }

  async remove(id: string, currentUserId: string) {
    // 不能删除自己
    if (id === currentUserId) {
      throw new ApiException('不能删除自己');
    }

    const user = await this.prisma.sysUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiException('用户不存在');
    }

    // 不能删除超级管理员
    if (user.userName === 'admin') {
      throw new ApiException('不能删除超级管理员');
    }

    // 检查角色关联
    const role = await this.prisma.sysRole.findFirst({
      where: {
        users: {
          some: {
            id,
          },
        },
      },
    });
    if (role) {
      throw new ApiException('该用户已分配角色，请先解除角色分配');
    }

    return this.prisma.sysUser.delete({
      where: {
        id,
      },
    });
  }
}
