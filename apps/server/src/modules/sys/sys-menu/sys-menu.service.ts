import { Injectable } from '@nestjs/common';
import {
  CreateSysMenuDto,
  GetSysMenuListDto,
  UpdateSysMenuDto,
} from './dto/req-sys-menu.dto';

import { buildMenuTree } from '@/utils/util';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SysMenuService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createSysMenuDto: CreateSysMenuDto) {
    const { meta, menuBtns, parentId, ...other } = createSysMenuDto;
    return await this.prisma.sysMenu.create({
      data: {
        ...other,
        parentId: parentId == 0 ? null : parentId,
        meta: {
          create: meta,
        },
        menuBtns: {
          createMany: {
            data: menuBtns,
          },
        },
      },
    });
  }

  async findAll(query: GetSysMenuListDto) {
    const { skip, take } = query;
    const where: Prisma.SysMenuWhereInput = {};

    if (query.name) {
      where.meta = {
        title: {
          contains: query.name,
        },
      };
    }
    if (query.status) {
      where.status = query.status;
    }
    const listPromise = this.prisma.sysMenu.findMany({
      where,
      skip,
      take,
      include: {
        meta: true,
      },
      orderBy: {
        sort: 'asc',
      },
    });
    const totalPromise = this.prisma.sysMenu.count({
      where: {
        ...where,
        // parentId: null,
      },
    });
    const [list, total] = await Promise.all([listPromise, totalPromise]);
    const treeList = list.map((item) => {
      return {
        ...item,
        parentId: item.parentId == null ? 0 : item.parentId,
      };
    });
    const tree = buildMenuTree(treeList, 0);
    return {
      list: tree,
      total,
    };
  }

  async findOne(id: number) {
    const menu = await this.prisma.sysMenu.findUnique({
      where: {
        id,
      },
      include: {
        meta: true,
        menuBtns: true,
        parent: true,
      },
    });
    if (!menu) {
      return null;
    }
    return {
      ...menu,
      parentId: menu.parentId == null ? 0 : menu.parentId,
    };
  }

  async update(id: number, updateSysMenuDto: UpdateSysMenuDto) {
    const { meta, menuBtns = [], parentId, ...other } = updateSysMenuDto;
    const metaInfo = meta ? { update: meta } : undefined;
    // TODO: 这里还需要删除角色菜单权限表的关系
    return await this.prisma.sysMenu.update({
      where: {
        id,
      },
      data: {
        ...other,
        parentId: parentId == 0 ? null : parentId,
        meta: metaInfo,
        menuBtns: {
          deleteMany: {},
          createMany: {
            data: menuBtns,
          },
        },
      },
    });
  }

  async remove(id: number) {
    // 需要级联删除掉数据
    this.prisma.$transaction(async (tx) => {
      //   1.需要删除角色菜单权限表关系
      //   2.需要删除角色按钮权限表关系
      //   3.删除菜单meta
      //   4.删除按钮信息
      //   5.删除菜单信息
    });

    return await this.prisma.sysMenu.delete({
      where: {
        id,
      },
    });
  }
}
