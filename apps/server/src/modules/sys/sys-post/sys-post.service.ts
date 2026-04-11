import { REDIS_KEYS } from '@/common/constants/redisKey.constant';
import { ApiException } from '@/common/exceptions/api.exception';
import { generateRedisKey, generateUUid } from '@/utils/util';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateSysPostDto,
  GetSysPostListDto,
  UpdateSysPostDto,
} from './dto/req-sys-post.dto';

@Injectable()
export class SysPostService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /* 新增 */
  async create(createSysPostDto: CreateSysPostDto) {
    const { deptId, ...other } = createSysPostDto;

    // 校验岗位编码是否已存在
    const existCode = await this.prisma.sysPost.findUnique({
      where: { code: createSysPostDto.code },
    });
    if (existCode) {
      throw new ApiException('岗位编码已存在');
    }

    // 校验部门是否存在
    if (deptId) {
      const dept = await this.prisma.sysDept.findUnique({
        where: { id: deptId },
      });
      if (!dept) {
        throw new ApiException('所属部门不存在');
      }
    }

    return this.prisma.sysPost.create({
      data: {
        ...other,
        id: generateUUid(),
        deptId: deptId || null,
      },
    });
  }

  /* 列表查询 */
  async findAll(query: GetSysPostListDto) {
    const { skip, take } = query;
    const where: Prisma.SysPostWhereInput = {};

    if (query.name) {
      where.name = { contains: query.name };
    }
    if (query.code) {
      where.code = { contains: query.code };
    }
    if (query.deptId !== undefined) {
      if (query.deptId === '') {
        // 空字符串表示只查询通用岗位
        where.deptId = null;
      } else if (query.includeChildren) {
        // 包含子部门：查询该部门及其所有子部门的岗位 + 通用岗位
        const childDeptIds = await this.getAllChildDeptIds(query.deptId);
        const deptIds = [query.deptId, ...childDeptIds];
        where.OR = [{ deptId: { in: deptIds } }, { deptId: null }];
      } else {
        // 不包含子部门：只查询该部门岗位 + 通用岗位
        where.OR = [{ deptId: query.deptId }, { deptId: null }];
      }
    }
    if (query.status) {
      where.status = query.status;
    }

    const listPromise = this.prisma.sysPost.findMany({
      where,
      skip,
      take,
      orderBy: [
        { dept: { sort: 'asc' } },
        { isLeader: 'desc' },
        { sort: 'asc' },
      ],
      include: {
        dept: {
          select: { id: true, deptName: true, sort: true },
        },
      },
    });

    const totalPromise = this.prisma.sysPost.count({ where });

    const [list, total] = await Promise.all([listPromise, totalPromise]);

    // 查询每个岗位的用户数量
    const postIds = list.map((item) => item.id);

    // 如果没有岗位，直接返回空列表
    if (postIds.length === 0) {
      return { list: [], total: 0 };
    }

    // 构建用户查询条件
    // 当指定部门时：部门岗位只统计该部门用户，通用岗位也只统计该部门用户
    // 当不指定部门时：统计所有用户
    type UserCountResult = { postId: string | null; _count: { id: number } };
    let userCounts: UserCountResult[];

    if (query.deptId !== undefined && query.deptId !== '') {
      // 指定了具体部门，需要分别处理部门岗位和通用岗位的用户统计
      const deptPostIds = list.filter((p) => p.deptId).map((p) => p.id);
      const commonPostIds = list.filter((p) => !p.deptId).map((p) => p.id);

      const [deptCounts, commonCounts] = await Promise.all([
        // 部门岗位：只统计该部门的用户
        this.prisma.sysUser.groupBy({
          by: ['postId'],
          where: { postId: { in: deptPostIds }, deptId: query.deptId },
          _count: { id: true },
        }) as unknown as UserCountResult[],
        // 通用岗位：统计该部门的用户
        this.prisma.sysUser.groupBy({
          by: ['postId'],
          where: { postId: { in: commonPostIds }, deptId: query.deptId },
          _count: { id: true },
        }) as unknown as UserCountResult[],
      ]);

      userCounts = [...deptCounts, ...commonCounts];
    } else if (query.deptId === '') {
      // 查询公司通用岗位（deptId=null），统计所有使用该岗位的用户
      userCounts = (await this.prisma.sysUser.groupBy({
        by: ['postId'],
        where: { postId: { in: postIds } },
        _count: { id: true },
      })) as unknown as UserCountResult[];
    } else {
      // 不指定部门，统计所有用户
      userCounts = (await this.prisma.sysUser.groupBy({
        by: ['postId'],
        where: { postId: { in: postIds } },
        _count: { id: true },
      })) as unknown as UserCountResult[];
    }

    const userCountMap = new Map(
      userCounts
        .filter((item) => item.postId)
        .map((item) => [item.postId!, item._count.id]),
    );

    // 添加 userCount 字段
    let listWithCount = list.map((item) => ({
      ...item,
      userCount: userCountMap.get(item.id) || 0,
    }));

    // 指定部门时，过滤掉没有用户的通用岗位
    if (query.deptId !== undefined && query.deptId !== '') {
      listWithCount = listWithCount.filter(
        (item) => item.deptId || item.userCount > 0,
      );
    }

    return { list: listWithCount, total: listWithCount.length };
  }

  /* 通过id查询 */
  async findOne(id: string) {
    return this.prisma.sysPost.findUnique({
      where: { id },
      include: {
        dept: {
          select: { id: true, deptName: true },
        },
      },
    });
  }

  /* 更新 */
  async update(id: string, updateSysPostDto: UpdateSysPostDto) {
    const { deptId, code, ...other } = updateSysPostDto;

    // 校验岗位编码是否已存在（排除自己）
    if (code) {
      const existCode = await this.prisma.sysPost.findFirst({
        where: {
          code,
          id: { not: id },
        },
      });
      if (existCode) {
        throw new ApiException('岗位编码已存在');
      }
    }

    // 校验部门是否存在
    if (deptId) {
      const dept = await this.prisma.sysDept.findUnique({
        where: { id: deptId },
      });
      if (!dept) {
        throw new ApiException('所属部门不存在');
      }
    }

    const post = await this.prisma.sysPost.update({
      where: { id },
      data: {
        ...other,
        code,
        deptId: deptId || null,
      },
    });

    // 清除该岗位下所有用户的缓存
    const users = await this.prisma.sysUser.findMany({
      where: { postId: id },
      select: { id: true },
    });
    for (const user of users) {
      await this.cacheManager.del(
        generateRedisKey(REDIS_KEYS.USER_INFO, user.id),
      );
    }

    return post;
  }

  /* 删除 */
  async remove(id: string) {
    // 检查是否有用户关联
    const userCount = await this.prisma.sysUser.count({
      where: { postId: id },
    });

    if (userCount > 0) {
      throw new ApiException('该岗位下存在用户，无法删除');
    }

    return this.prisma.sysPost.delete({
      where: { id },
    });
  }

  /* 批量删除 */
  async removes(ids: string[]) {
    // 检查是否有用户关联
    const userCount = await this.prisma.sysUser.count({
      where: { postId: { in: ids } },
    });

    if (userCount > 0) {
      throw new ApiException('所选岗位下存在用户，无法删除');
    }

    return this.prisma.sysPost.deleteMany({
      where: { id: { in: ids } },
    });
  }

  /* 获取岗位选项列表（用于下拉选择） */
  async getOptions(deptId?: string) {
    const where: Prisma.SysPostWhereInput = {
      status: '0', // 只返回启用状态的岗位
    };

    // 如果指定了部门ID，返回公司通用岗位 + 该部门的岗位
    if (deptId) {
      where.OR = [{ deptId: null }, { deptId }];
    } else {
      // 没有指定部门，只返回公司通用岗位
      where.deptId = null;
    }

    const posts = await this.prisma.sysPost.findMany({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        isLeader: true,
        deptId: true,
      },
      orderBy: { sort: 'asc' },
    });

    return posts.map((post) => ({
      value: post.id,
      label: post.name,
      isLeader: post.isLeader,
    }));
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
}
