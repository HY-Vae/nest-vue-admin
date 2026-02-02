import { PrismaClient } from '@prisma/client';

const menuBtns = [
  {
    id: 6,
    name: '新增',
    auth: 'system:menu:create',
    sysMenuId: 8,
    createAt: '2025-11-06T09:49:36.755Z',
    updateAt: '2025-11-06T09:49:36.755Z',
  },
  {
    id: 7,
    name: '单个删除',
    auth: 'system:menu:remove',
    sysMenuId: 8,
    createAt: '2025-11-06T09:49:36.755Z',
    updateAt: '2025-11-06T09:49:36.755Z',
  },
  {
    id: 8,
    name: '批量删除',
    auth: 'system:menu:removes',
    sysMenuId: 8,
    createAt: '2025-11-06T09:49:36.755Z',
    updateAt: '2025-11-06T09:49:36.755Z',
  },
  {
    id: 9,
    name: '编辑',
    auth: 'system:menu:update',
    sysMenuId: 8,
    createAt: '2025-11-06T09:49:36.755Z',
    updateAt: '2025-11-06T09:49:36.755Z',
  },
  {
    id: 10,
    name: '查询列表',
    auth: 'system:menu:list',
    sysMenuId: 8,
    createAt: '2025-11-06T09:49:36.755Z',
    updateAt: '2025-11-06T09:49:36.755Z',
  },
  {
    id: 11,
    name: '查询详情',
    auth: 'sys:menu:detail',
    sysMenuId: 8,
    createAt: '2025-11-06T09:49:36.755Z',
    updateAt: '2025-11-06T09:49:36.755Z',
  },
];

export async function initMenuBtns(prisma: PrismaClient) {
  for (let i = 0; i < menuBtns.length; i++) {
    const menuBtn = menuBtns[i];
    const isExist = await prisma.sysMenuBtn.findFirst({
      where: {
        name: menuBtn.name,
        auth: menuBtn.auth,
      },
    });
    if (!isExist) {
      await prisma.sysMenuBtn.create({
        data: menuBtn,
      });
    }
  }
}
