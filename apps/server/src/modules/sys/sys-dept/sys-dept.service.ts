import { REDIS_KEYS } from '@/common/constants/redisKey.constant';
import { ApiException } from '@/common/exceptions/api.exception';
import { generateRedisKey, generateUUid } from '@/utils/util';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateSysDeptDto,
  GetSysDeptListDto,
  UpdateSysDeptDto,
} from './dto/req-sys-dept.dto';
import type {
  DeptTreeNode,
  DeptWithPosts,
  DeptWithUserCount,
  OrgTreeNode,
  PostNode,
} from './interfaces/sys-dept.interface';

@Injectable()
export class SysDeptService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /* 新增 */
  async create(createSysDeptDto: CreateSysDeptDto) {
    const { parentId, ...other } = createSysDeptDto;

    let ancestors = '';
    // 校验父级部门是否存在，并计算 ancestors
    if (parentId) {
      const parent = await this.prisma.sysDept.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        throw new ApiException('父级部门不存在');
      }
      ancestors = parent.ancestors
        ? `${parent.ancestors},${parent.id}`
        : parent.id;
    }

    return this.prisma.sysDept.create({
      data: {
        ...other,
        id: generateUUid(),
        parentId: parentId || null,
        ancestors,
      },
    });
  }

  /* 列表查询（返回树形结构） */
  async findAll(query: GetSysDeptListDto) {
    const where: Prisma.SysDeptWhereInput = {};

    if (query.deptName != undefined) {
      where.deptName = { contains: query.deptName };
    }
    if (query.deptCode != undefined) {
      where.deptCode = { contains: query.deptCode };
    }
    if (query.status != undefined) {
      where.status = query.status;
    }

    // 查询所有部门
    const list = await this.prisma.sysDept.findMany({
      where,
      orderBy: { sort: 'asc' },
    });

    const deptIds = list.map((d) => d.id);

    // 如果没有部门，直接返回空树
    if (deptIds.length === 0) {
      return { list: [], total: 0 };
    }

    // 并行查询用户数和负责人
    const [deptUserCounts, leaders] = await Promise.all([
      // 查询每个部门的人数
      this.prisma.sysUser.groupBy({
        by: ['deptId'],
        _count: { id: true },
        where: { deptId: { in: deptIds } },
      }),
      // 查询每个部门的负责人
      this.prisma.sysUser.findMany({
        where: { deptId: { in: deptIds }, post: { isLeader: true } },
        select: { id: true, nickName: true, userName: true, deptId: true },
      }),
    ]);

    // 构建 Map
    const userCountMap = new Map(
      deptUserCounts.map((item) => [item.deptId, item._count.id]),
    );
    const leaderMap = new Map<string, { id: string; name: string }[]>();
    for (const leader of leaders) {
      const arr = leaderMap.get(leader.deptId!) || [];
      arr.push({ id: leader.id, name: leader.nickName || leader.userName });
      leaderMap.set(leader.deptId!, arr);
    }

    // 为每个部门添加人数和负责人信息
    const listWithCount: DeptWithUserCount[] = list.map((item) => {
      const deptLeaders = leaderMap.get(item.id) || [];
      return {
        ...item,
        userCount: userCountMap.get(item.id) || 0,
        leaders: deptLeaders,
        leaderName: deptLeaders.map((l) => l.name).join('、') || null,
      };
    });

    // 构建树形结构并计算总人数
    const tree = this.buildTree(listWithCount);
    this.calculateTotalUserCount(tree);

    return { list: tree, total: list.length };
  }

  /* 构建树形结构 */
  private buildTree(
    list: DeptWithUserCount[],
    parentId: string | null = null,
  ): DeptTreeNode[] {
    return list
      .filter((item) => item.parentId === parentId)
      .map((item) => ({
        ...item,
        children: this.buildTree(list, item.id),
      }));
  }

  /* 计算每个部门的总人数（包含子部门） */
  private calculateTotalUserCount(nodes: DeptTreeNode[]): number {
    let total = 0;
    for (const node of nodes) {
      // 先递归计算子部门
      const childrenTotal = node.children?.length
        ? this.calculateTotalUserCount(node.children)
        : 0;
      // 总人数 = 自己的人数 + 子部门的总人数
      node.totalUserCount = (node.userCount || 0) + childrenTotal;
      total += node.totalUserCount;
    }
    return total;
  }

  /* 通过id查询 */
  async findOne(id: string) {
    const dept = await this.prisma.sysDept.findUnique({
      where: { id },
    });

    if (!dept) {
      return null;
    }

    // 查询部门负责人
    const leaders = await this.prisma.sysUser.findMany({
      where: {
        deptId: id,
        post: { isLeader: true },
      },
      select: {
        id: true,
        nickName: true,
        userName: true,
      },
    });

    return {
      ...dept,
      leaders: leaders.map((l) => ({
        id: l.id,
        name: l.nickName || l.userName,
      })),
    };
  }

  /* 更新 */
  async update(id: string, updateSysDeptDto: UpdateSysDeptDto) {
    const { parentId, ...other } = updateSysDeptDto;

    // 校验：父级不能是自己
    if (parentId === id) {
      throw new ApiException('父级部门不能是自己');
    }

    // 如果 parentId 有值，需要重新计算 ancestors
    let ancestors: string | undefined;
    if (parentId !== undefined) {
      if (parentId) {
        const parent = await this.prisma.sysDept.findUnique({
          where: { id: parentId },
        });
        if (!parent) {
          throw new ApiException('父级部门不存在');
        }
        ancestors = parent.ancestors
          ? `${parent.ancestors},${parent.id}`
          : parent.id;
      } else {
        ancestors = '';
      }
    }

    const dept = await this.prisma.sysDept.update({
      where: { id },
      data: {
        ...other,
        ...(parentId !== undefined && { parentId: parentId || null }),
        ...(ancestors !== undefined && { ancestors }),
      },
    });

    // 如果 ancestors 变了，级联更新所有子部门的 ancestors
    if (ancestors !== undefined) {
      await this.updateChildAncestors(id, ancestors);
    }

    // 清除该部门下所有用户的缓存
    const users = await this.prisma.sysUser.findMany({
      where: { deptId: id },
      select: { id: true },
    });
    for (const user of users) {
      await this.cacheManager.del(
        generateRedisKey(REDIS_KEYS.USER_INFO, user.id),
      );
    }

    return dept;
  }

  /**
   * 递归更新子部门的 ancestors
   */
  private async updateChildAncestors(
    parentId: string,
    parentAncestors: string,
  ) {
    const children = await this.prisma.sysDept.findMany({
      where: { parentId },
      select: { id: true },
    });
    for (const child of children) {
      const childAncestors = parentAncestors
        ? `${parentAncestors},${parentId}`
        : parentId;
      await this.prisma.sysDept.update({
        where: { id: child.id },
        data: { ancestors: childAncestors },
      });
      await this.updateChildAncestors(child.id, childAncestors);
    }
  }

  /* 删除 */
  async remove(id: string) {
    // 检查是否有子部门
    const childCount = await this.prisma.sysDept.count({
      where: { parentId: id },
    });

    if (childCount > 0) {
      throw new ApiException('该部门下存在子部门，无法删除');
    }

    // 检查是否有用户
    const userCount = await this.prisma.sysUser.count({
      where: { deptId: id },
    });

    if (userCount > 0) {
      throw new ApiException('该部门下存在用户，无法删除');
    }

    return this.prisma.sysDept.delete({
      where: { id },
    });
  }

  /* 批量删除 */
  async removes(ids: string[]) {
    // 检查是否有子部门
    const childCount = await this.prisma.sysDept.count({
      where: { parentId: { in: ids } },
    });

    if (childCount > 0) {
      throw new ApiException('所选部门下存在子部门，无法删除');
    }

    // 检查是否有用户
    const userCount = await this.prisma.sysUser.count({
      where: { deptId: { in: ids } },
    });

    if (userCount > 0) {
      throw new ApiException('所选部门下存在用户，无法删除');
    }

    return this.prisma.sysDept.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  /* 获取组织架构树（部门 + 岗位） */
  async findOrgTree() {
    // 并行查询部门和岗位
    const [depts, posts] = await Promise.all([
      this.prisma.sysDept.findMany({
        where: { status: '0' },
        orderBy: { sort: 'asc' },
        select: {
          id: true,
          deptName: true,
          deptCode: true,
          parentId: true,
          sort: true,
          status: true,
        },
      }),
      this.prisma.sysPost.findMany({
        where: { status: '0' },
        orderBy: [{ deptId: 'asc' }, { sort: 'asc' }],
        select: {
          id: true,
          name: true,
          code: true,
          deptId: true,
          isLeader: true,
          sort: true,
        },
      }),
    ]);

    const deptIds = depts.map((d) => d.id);
    const postIds = posts.map((p) => p.id);

    // 如果没有部门或岗位，直接返回空树
    if (deptIds.length === 0 || postIds.length === 0) {
      return [];
    }

    // 并行查询用户数
    const [deptUserCounts, postUserCounts] = await Promise.all([
      // 部门用户数
      this.prisma.sysUser.groupBy({
        by: ['deptId'],
        _count: { id: true },
        where: { deptId: { in: deptIds } },
      }),
      // 岗位用户数（按 postId + deptId 分组，用于统计每个岗位在各部门的人数）
      this.prisma.sysUser.groupBy({
        by: ['postId', 'deptId'],
        _count: { id: true },
        where: { postId: { in: postIds }, deptId: { in: deptIds } },
      }),
    ]);

    // 构建 Map
    const userCountMap = new Map(
      deptUserCounts.map((item) => [item.deptId, item._count.id]),
    );
    // key: `postId_deptId`，value: 用户数
    const postUserCountMap = new Map(
      postUserCounts.map((item) => [
        `${item.postId}_${item.deptId}`,
        item._count.id,
      ]),
    );

    // 通用岗位（deptId=null）
    const commonPosts = posts.filter((p) => !p.deptId);

    // 为每个部门构建岗位列表
    const deptWithPosts: DeptWithPosts[] = depts.map((dept) => {
      // 部门专属岗位
      const deptPosts: PostNode[] = posts
        .filter((p) => p.deptId === dept.id)
        .map((p) => ({
          ...p,
          userCount: postUserCountMap.get(`${p.id}_${dept.id}`) || 0,
          nodeType: 'post' as const,
          isCommon: false,
        }));

      // 通用岗位（该部门有人使用的才显示）
      const usedCommonPosts: PostNode[] = commonPosts
        .filter((p) => (postUserCountMap.get(`${p.id}_${dept.id}`) || 0) > 0)
        .map((p) => ({
          ...p,
          userCount: postUserCountMap.get(`${p.id}_${dept.id}`) || 0,
          nodeType: 'post' as const,
          isCommon: true,
        }));

      return {
        ...dept,
        userCount: userCountMap.get(dept.id) || 0,
        nodeType: 'dept' as const,
        posts: [...deptPosts, ...usedCommonPosts],
      };
    });

    // 构建树形结构
    const buildOrgTree = (parentId: string | null = null): OrgTreeNode[] => {
      return deptWithPosts
        .filter((dept) => dept.parentId === parentId)
        .map((dept) => {
          const childDepts = buildOrgTree(dept.id);
          // 岗位排序：负责人优先，然后按 sort 升序
          const childPosts: OrgTreeNode[] = dept.posts
            .sort((a, b) => {
              if (a.isLeader !== b.isLeader) return a.isLeader ? -1 : 1;
              return (a.sort || 0) - (b.sort || 0);
            })
            .map((p) => ({
              ...p,
              parentId: null,
              sort: p.sort || 0,
              status: '0',
              children: [],
            }));

          return {
            id: dept.id,
            name: dept.deptName,
            code: dept.deptCode,
            parentId: dept.parentId,
            sort: dept.sort,
            status: dept.status,
            userCount: dept.userCount,
            nodeType: 'dept' as const,
            children: [...childDepts, ...childPosts],
          };
        });
    };

    const tree = buildOrgTree();
    this.calculateOrgTotalUserCount(tree);

    return tree;
  }

  /* 计算组织架构树的总人数 */
  private calculateOrgTotalUserCount(nodes: OrgTreeNode[]): number {
    let total = 0;
    for (const node of nodes) {
      if (node.nodeType === 'dept') {
        const childrenTotal = node.children?.length
          ? this.calculateOrgTotalUserCount(
              node.children.filter((c) => c.nodeType === 'dept'),
            )
          : 0;
        node.totalUserCount = (node.userCount || 0) + childrenTotal;
        total += node.totalUserCount;
      }
    }
    return total;
  }
}
