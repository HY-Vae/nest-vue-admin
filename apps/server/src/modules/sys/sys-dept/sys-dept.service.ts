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

    // 构建树形结构
    const tree = this.buildTree(list);

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

  /* 通过id查询 */
  async findOne(id: string) {
    return this.prisma.sysDept.findUnique({
      where: { id },
    });
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

    return this.prisma.sysDept.delete({
      where: { id },
    });
  }

  /* 批量删除 */
  async removes(ids: string[]) {
    return this.prisma.sysDept.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }
}
