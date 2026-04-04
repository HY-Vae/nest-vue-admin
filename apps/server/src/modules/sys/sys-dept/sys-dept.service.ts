import { ApiException } from '@/common/exceptions/api.exception';
import { generateUUid } from '@/utils/util';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateSysDeptDto,
  GetSysDeptListDto,
  UpdateSysDeptDto,
} from './dto/req-sys-dept.dto';

@Injectable()
export class SysDeptService {
  constructor(private readonly prisma: PrismaService) {}

  /* 新增 */
  async create(createSysDeptDto: CreateSysDeptDto) {
    const { parentId, ...other } = createSysDeptDto;

    // 校验父级部门是否存在
    if (parentId) {
      const parent = await this.prisma.sysDept.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        throw new ApiException('父级部门不存在');
      }
    }

    return this.prisma.sysDept.create({
      data: {
        ...other,
        id: generateUUid(),
        parentId: parentId || null,
      },
    });
  }

  /* 列表查询（返回树形结构） */
  async findAll(query: GetSysDeptListDto) {
    const where: Prisma.SysDeptWhereInput = {};

    if (query.deptName != undefined) {
      where.deptName = {
        contains: query.deptName,
      };
    }
    if (query.deptCode != undefined) {
      where.deptCode = {
        contains: query.deptCode,
      };
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

    // 查询每个部门的人数
    const deptUserCounts = await this.prisma.sysUser.groupBy({
      by: ['deptId'],
      _count: { id: true },
      where: { deptId: { in: deptIds } },
    });

    // 查询每个部门的负责人（岗位 isLeader=true 的用户）
    const leaders = await this.prisma.sysUser.findMany({
      where: {
        deptId: { in: deptIds },
        post: { isLeader: true },
      },
      select: {
        id: true,
        nickName: true,
        userName: true,
        deptId: true,
      },
    });

    // 转换为 Map 方便查询
    const userCountMap = new Map(
      deptUserCounts.map((item) => [item.deptId, item._count.id]),
    );

    // 负责人 Map（每个部门可能有多个负责人）
    const leaderMap = new Map<string, { id: string; name: string }[]>();
    for (const leader of leaders) {
      if (!leaderMap.has(leader.deptId!)) {
        leaderMap.set(leader.deptId!, []);
      }
      leaderMap.get(leader.deptId!)!.push({
        id: leader.id,
        name: leader.nickName || leader.userName,
      });
    }

    // 为每个部门添加人数和负责人信息
    const listWithCount = list.map((item) => {
      const deptLeaders = leaderMap.get(item.id) || [];
      return {
        ...item,
        userCount: userCountMap.get(item.id) || 0,
        leaders: deptLeaders,
        leaderName: deptLeaders.map((l) => l.name).join('、') || null,
      };
    });

    // 构建树形结构
    const tree = this.buildTree(listWithCount);

    // 计算每个部门的总人数（包含子部门）
    this.calculateTotalUserCount(tree);

    return {
      list: tree,
      total: list.length,
    };
  }

  /* 构建树形结构 */
  private buildTree(
    list: any[],
    parentId: string | null = null,
  ): any[] {
    return list
      .filter((item) => item.parentId === parentId)
      .map((item) => ({
        ...item,
        children: this.buildTree(list, item.id),
      }));
  }

  /* 计算每个部门的总人数（包含子部门） */
  private calculateTotalUserCount(nodes: any[]): number {
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

    return this.prisma.sysDept.update({
      where: { id },
      data: {
        ...other,
        parentId: parentId || null,
      },
    });
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
    // 查询所有部门
    const depts = await this.prisma.sysDept.findMany({
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
    });

    const deptIds = depts.map((d) => d.id);

    // 查询每个部门的人数
    const deptUserCounts = await this.prisma.sysUser.groupBy({
      by: ['deptId'],
      _count: { id: true },
      where: { deptId: { in: deptIds } },
    });

    const userCountMap = new Map(
      deptUserCounts.map((item) => [item.deptId, item._count.id]),
    );

    // 查询所有岗位（按部门分组）
    const posts = await this.prisma.sysPost.findMany({
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
    });

    // 查询每个岗位的人数（按部门过滤）
    const postIds = posts.map((p) => p.id);
    const postUserCounts = await this.prisma.sysUser.groupBy({
      by: ['postId', 'deptId'],
      _count: { id: true },
      where: { postId: { in: postIds }, deptId: { in: deptIds } },
    });

    // 构建岗位用户数 Map: key = `${postId}_${deptId}`
    const postUserCountMap = new Map(
      postUserCounts.map((item) => [`${item.postId}_${item.deptId}`, item._count.id]),
    );

    // 查询通用岗位（deptId=null）的用户数
    const commonPosts = posts.filter((p) => !p.deptId);
    const commonPostIds = commonPosts.map((p) => p.id);
    const commonPostUserCounts = await this.prisma.sysUser.groupBy({
      by: ['postId'],
      where: { postId: { in: commonPostIds }, deptId: { in: deptIds } },
      _count: { id: true },
    });

    const commonPostUserCountMap = new Map(
      commonPostUserCounts.map((item) => [item.postId, item._count.id]),
    );

    // 为每个部门添加岗位列表
    const deptWithPosts = depts.map((dept) => {
      // 该部门的专属岗位
      const deptPosts = posts
        .filter((p) => p.deptId === dept.id)
        .map((p) => ({
          id: p.id,
          name: p.name,
          code: p.code,
          isLeader: p.isLeader,
          sort: p.sort,
          userCount: postUserCountMap.get(`${p.id}_${dept.id}`) || 0,
          nodeType: 'post' as const,
        }));

      // 该部门使用的通用岗位（有人使用的才显示）
      const usedCommonPosts = commonPosts
        .map((p) => ({
          id: p.id,
          name: p.name,
          code: p.code,
          isLeader: p.isLeader,
          sort: p.sort,
          userCount: commonPostUserCountMap.get(p.id) || 0,
          nodeType: 'post' as const,
          isCommon: true,
        }))
        .filter((p) => {
          // 只显示该部门有人使用的通用岗位
          const count = postUserCountMap.get(`${p.id}_${dept.id}`) || 0;
          return count > 0;
        })
        .map((p) => ({
          ...p,
          userCount: postUserCountMap.get(`${p.id}_${dept.id}`) || 0,
        }));

      return {
        ...dept,
        userCount: userCountMap.get(dept.id) || 0,
        nodeType: 'dept' as const,
        posts: [...deptPosts, ...usedCommonPosts],
      };
    });

    // 构建树形结构（部门 + 岗位作为子节点）
    const buildOrgTree = (parentId: string | null = null): any[] => {
      return deptWithPosts
        .filter((dept) => dept.parentId === parentId)
        .map((dept) => {
          const childDepts = buildOrgTree(dept.id);
          // 岗位排序：负责人优先，然后按 sort 升序
          const childPosts = (dept.posts || []).sort((a, b) => {
            if (a.isLeader !== b.isLeader) {
              return a.isLeader ? -1 : 1;
            }
            return (a.sort || 0) - (b.sort || 0);
          });

          return {
            id: dept.id,
            name: dept.deptName,
            code: dept.deptCode,
            parentId: dept.parentId,
            sort: dept.sort,
            status: dept.status,
            userCount: dept.userCount,
            nodeType: 'dept',
            // 子节点：先子部门，后岗位
            children: [...childDepts, ...childPosts],
          };
        });
    };

    const tree = buildOrgTree();

    // 计算每个部门的总人数（包含子部门）
    const calculateTotalUserCount = (nodes: any[]): number => {
      let total = 0;
      for (const node of nodes) {
        if (node.nodeType === 'dept') {
          const childrenTotal = node.children?.length
            ? calculateTotalUserCount(
                node.children.filter((c: any) => c.nodeType === 'dept'),
              )
            : 0;
          node.totalUserCount = (node.userCount || 0) + childrenTotal;
          total += node.totalUserCount;
        }
      }
      return total;
    };

    calculateTotalUserCount(tree);

    return tree;
  }
}
