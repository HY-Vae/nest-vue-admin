import { Injectable } from '@nestjs/common';
import {
  CreateSysMenuDto,
  GetSysMenuListDto,
  UpdateSysMenuDto,
} from './dto/req-sys-menu.dto';

import { ApiException } from '@/common/exceptions/api.exception';
import { buildMenuTree } from '@/utils/util';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SysMenuService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createSysMenuDto: CreateSysMenuDto) {
    const {
      meta,
      menuBtns = [],
      parameters = [],
      parentId,
      ...other
    } = createSysMenuDto;
    return this.prisma.sysMenu.create({
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
        parameters: {
          createMany: {
            data: parameters,
          },
        },
      },
    });
  }

  async findAll(query: GetSysMenuListDto) {
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
      include: {
        meta: true,
      },
      orderBy: {
        sort: 'asc',
      },
    });
    const totalPromise = this.prisma.sysMenu.count({
      where,
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
        parameters: true,
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
    const {
      meta,
      menuBtns = [],
      parameters = [],
      parentId,
      ...other
    } = updateSysMenuDto;

    const exists = await this.prisma.sysMenu.findUnique({ where: { id } });
    if (!exists) throw new ApiException('当前菜单信息不存在');
    // 因为这里有关联表的缘故，所以不能全部删除再新增，需要判断数据是删除还是新增还有编辑
    // 找出列表里带 ID 的（说明是老数据，需要 Update）
    const updates = menuBtns.filter((btn) => btn.id != undefined);
    // 找出列表里不带 ID 的（说明是新数据，需要 Create）
    const creates = menuBtns.filter((btn) => !btn.id);

    // 提取出“幸存者”的 ID 列表
    const keepIds: number[] = updates.map((btn) => btn.id as number);
    return this.prisma.$transaction(async (tx) => {
      // 数据库里属于这个菜单，但不在 keepIds 列表里的，统统删掉
      await tx.sysMenuBtn.deleteMany({
        where: {
          sysMenuId: id,
          id: {
            notIn: keepIds,
          },
        },
      });
      //   更新数据
      if (updates.length > 0) {
        await Promise.all(
          updates.map((btn) => {
            const { id, ...data } = btn;
            return tx.sysMenuBtn.update({
              where: { id },
              data: data, // 只更新 name, auth
            });
          }),
        );
      }
      if (creates.length > 0) {
        await tx.sysMenuBtn.createMany({
          data: creates.map((btn) => ({
            ...btn,
            sysMenuId: id, // 绑定父菜单
          })),
        });
      }
      const metaInfo = meta ? { update: meta } : undefined;
      return tx.sysMenu.update({
        where: {
          id,
        },
        data: {
          ...other,
          parentId: parentId == 0 ? null : parentId,
          meta: metaInfo,
          parameters: {
            deleteMany: {},
            createMany: {
              data: parameters,
            },
          },
        },
      });
    });
  }

  async remove(id: number) {
    const menu = await this.prisma.sysMenu.findUnique({ where: { id } });
    if (!menu) throw new ApiException('菜单不存在');

    // 检查是否有子菜单
    const childCount = await this.prisma.sysMenu.count({
      where: { parentId: id },
    });
    if (childCount > 0) throw new ApiException('请先删除子菜单');

    // 删除菜单，数据库 ON DELETE CASCADE 自动清理：
    // meta、btns、parameters、角色-菜单关联、角色-按钮关联
    return this.prisma.sysMenu.delete({ where: { id } });
  }
}
