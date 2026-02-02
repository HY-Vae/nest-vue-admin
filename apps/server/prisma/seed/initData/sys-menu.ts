import { PrismaClient } from '@prisma/client';

const menuTree = [
  {
    id: 7,
    parentId: null,
    path: '/sys',
    name: 'sys',
    auth: 'sys',
    hidden: false,
    component: 'views/layout/basic.vue',
    status: '0',
    sort: 0,
    remark: '',
    createBy: 'nva',
    createAt: '2025-11-03T06:52:00.686Z',
    updateBy: 'nva',
    updateAt: '2025-11-11T05:10:45.031Z',
    meta: {
      id: 3,
      activeName: '',
      keepAlive: false,
      defaultMenu: false,
      title: '系统管理',
      icon: '',
      closeTab: true,
      sysMenuId: 7,
    },
    children: [
      {
        id: 8,
        parentId: 7,
        path: 'menu',
        name: 'menu',
        auth: 'sys:menu:page',
        hidden: false,
        component: 'views/sys/menu/menu.vue',
        status: '0',
        sort: 0,
        remark: '',
        createBy: 'nva',
        createAt: '2025-11-03T06:54:29.901Z',
        updateBy: 'nva',
        updateAt: '2025-11-06T09:49:36.755Z',
        meta: {
          id: 4,
          activeName: '',
          keepAlive: false,
          defaultMenu: false,
          title: '菜单配置',
          icon: '',
          closeTab: true,
          sysMenuId: 8,
        },
        children: [],
      },
      {
        id: 12,
        parentId: 7,
        path: 'role',
        name: 'role',
        auth: 'sys:role',
        hidden: false,
        component: 'views/sys/role/role.vue',
        status: '0',
        sort: 1,
        remark: '',
        createBy: 'nva',
        createAt: '2025-11-06T03:19:44.642Z',
        updateBy: null,
        updateAt: '2025-11-06T03:19:44.642Z',
        meta: {
          id: 8,
          activeName: '',
          keepAlive: false,
          defaultMenu: false,
          title: '角色管理',
          icon: '',
          closeTab: true,
          sysMenuId: 12,
        },
        children: [],
      },
      {
        id: 10,
        parentId: 7,
        path: 'dict',
        name: 'dict',
        auth: 'sys:dict:page',
        hidden: false,
        component: 'views/sys/dict/dict.vue',
        status: '0',
        sort: 2,
        remark: '',
        createBy: 'nva',
        createAt: '2025-11-06T00:31:54.110Z',
        updateBy: 'nva',
        updateAt: '2025-11-06T03:20:34.979Z',
        meta: {
          id: 6,
          activeName: '',
          keepAlive: false,
          defaultMenu: false,
          title: '字典表',
          icon: '',
          closeTab: true,
          sysMenuId: 10,
        },
        children: [],
      },
      {
        id: 11,
        parentId: 7,
        path: 'dict-detail/:code',
        name: 'dict-detail',
        auth: 'sys:dictDetail:page',
        hidden: true,
        component: 'views/sys/dictDetail/dictDetail.vue',
        status: '0',
        sort: 2,
        remark: '',
        createBy: 'nva',
        createAt: '2025-11-06T00:33:39.482Z',
        updateBy: 'nva',
        updateAt: '2025-11-06T03:20:41.722Z',
        meta: {
          id: 7,
          activeName: '',
          keepAlive: false,
          defaultMenu: false,
          title: '字典表详情',
          icon: '',
          closeTab: true,
          sysMenuId: 11,
        },
        children: [],
      },
    ],
  },
  {
    id: 13,
    parentId: null,
    path: '/tool',
    name: 'tool',
    auth: 'tool',
    hidden: false,
    component: 'views/layout/basic.vue',
    status: '0',
    sort: 1,
    remark: '',
    createBy: 'nva',
    createAt: '2025-11-07T09:28:40.428Z',
    updateBy: null,
    updateAt: '2025-11-07T09:28:40.428Z',
    meta: {
      id: 9,
      activeName: '',
      keepAlive: false,
      defaultMenu: false,
      title: '代码生成',
      icon: '',
      closeTab: true,
      sysMenuId: 13,
    },
    children: [
      {
        id: 14,
        parentId: 13,
        path: 'temp',
        name: 'temp',
        auth: 'tool:temp:page',
        hidden: false,
        component: 'views/tool/temp/temp.vue',
        status: '0',
        sort: 0,
        remark: '',
        createBy: 'nva',
        createAt: '2025-11-07T09:29:57.743Z',
        updateBy: null,
        updateAt: '2025-11-07T09:29:57.743Z',
        meta: {
          id: 10,
          activeName: '',
          keepAlive: false,
          defaultMenu: false,
          title: '模板管理',
          icon: '',
          closeTab: true,
          sysMenuId: 14,
        },
        children: [],
      },
      {
        id: 15,
        parentId: 13,
        path: 'gen',
        name: 'gen',
        auth: 'tool:gen',
        hidden: false,
        component: 'views/tool/gen/gen.vue',
        status: '0',
        sort: 1,
        remark: '',
        createBy: 'nva',
        createAt: '2025-11-11T00:21:51.822Z',
        updateBy: 'nva',
        updateAt: '2025-11-11T00:23:25.808Z',
        meta: {
          id: 11,
          activeName: '',
          keepAlive: false,
          defaultMenu: false,
          title: '生成代码',
          icon: '',
          closeTab: true,
          sysMenuId: 15,
        },
        children: [],
      },
    ],
  },
];

const menus: any[] = [];
const transMenusTree = (menuTree: any[]) => {
  for (let i = 0; i < menuTree.length; i++) {
    const menu = menuTree[i];
    const { children, ...other } = menu;
    menus.push(other);
    if (children?.length) {
      transMenusTree(children);
    }
  }
};
export async function initMenus(prisma: PrismaClient) {
  //   查询是否存在
  transMenusTree(menuTree);
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i];
    const isExist = await prisma.sysMenu.findFirst({
      where: {
        name: menu.name,
        path: menu.path,
        auth: menu.auth,
      },
    });
    if (!isExist) {
      const { meta, ...other } = menu;
      await prisma.sysMenu.create({
        data: {
          ...other,
        },
      });
      await prisma.sysMenuMeta.create({
        data: {
          ...meta,
        },
      });
    }
  }
}
