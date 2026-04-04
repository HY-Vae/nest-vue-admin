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
    if (query.deptId) {
      // 如果 includeChildren 为 true，查询该部门及其所有子部门的用户
      if (query.includeChildren) {
        // 获取所有子部门 ID
        const childDeptIds = await this.getAllChildDeptIds(query.deptId);
        where.deptId = { in: [query.deptId, ...childDeptIds] };
      } else {
        where.deptId = query.deptId;
      }
    }
    if (query.postId) {
      where.postId = query.postId;
    }

    const listPromise = this.prisma.sysUser.findMany({
      where,
      skip,
      take,
      omit: {
        password: true,
      },
      include: {
        dept: {
          select: { id: true, deptName: true, sort: true, parentId: true },
        },
        post: {
          select: { id: true, name: true, isLeader: true },
        },
      },
      orderBy: [
        // 父部门（parentId=null）排前面
        { dept: { parentId: { sort: 'asc', nulls: 'first' } } },
        // 同级按部门 sort 排序
        { dept: { sort: 'asc' } },
        // 部门内负责人优先
        { post: { isLeader: 'desc' } },
      ],
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

  /* 递归获取所有子部门 ID */
  private async getAllChildDeptIds(parentId: string): Promise<string[]> {
    const children = await this.prisma.sysDept.findMany({
      where: { parentId },
      select: { id: true },
    });
    const ids = children.map((c) => c.id);
    for (const id of ids) {
      const childIds = await this.getAllChildDeptIds(id);
      ids.push(...childIds);
    }
    return ids;
  }

  async findOne(id: string) {
    const user = await this.prisma.sysUser.findUnique({
      where: {
        id,
      },
      include: {
        roles: true,
        post: {
          select: { id: true, name: true },
        },
      },
      omit: {
        password: true,
      },
    });
    if (!user) {
      return null;
    }
    const { roles, post, ...other } = user;
    const roleIds = roles.map((role) => role.id);
    return {
      ...other,
      roleIds,
      postId: post?.id || null,
      postName: post?.name || null,
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

  /* 获取用户选项列表（用于下拉选择） */
  async getOptions() {
    const users = await this.prisma.sysUser.findMany({
      where: {
        status: '0', // 只返回启用状态的用户
      },
      select: {
        id: true,
        nickName: true,
        userName: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users.map((user) => ({
      value: user.id,
      label: user.nickName || user.userName,
    }));
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
