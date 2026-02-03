import { PrismaClient } from '@prisma/client';

const menuTree = [];

export async function initMenus(prisma: PrismaClient) {
  console.log('开始初始化菜单数据...');
  const sysRoot = await prisma.sysMenu.create({
    data: {
      path: '/sys',
      name: 'sys',
      auth: 'sys',
      component: 'views/layout/basic.vue',
      sort: 1,
      status: '0',
      meta: {
        create: {
          title: '系统管理',
          icon: 'ri:settings-5-line',
          closeTab: true,
        },
      },
    },
  });

  await prisma.sysMenu.create({
    data: {
      parentId: sysRoot.id,
      path: '/sys/menu',
      name: 'menu',
      auth: 'sys:menu',
      component: 'views/sys/menu/menu.vue',
      sort: 0,
      status: '0',
      meta: {
        create: { title: '菜单配置', icon: 'ri:menu-line', closeTab: true },
      },
      menuBtns: {
        create: [
          { name: '新增', auth: 'system:menu:create' },
          { name: '单个删除', auth: 'system:menu:remove' },
          { name: '批量删除', auth: 'system:menu:removes' }, // SQL ID 155
          { name: '编辑', auth: 'system:menu:update' },
          { name: '查询列表', auth: 'system:menu:list' },
          { name: '查询详情', auth: 'sys:menu:detail' },
        ],
      },
    },
  });

  await prisma.sysMenu.create({
    data: {
      parentId: sysRoot.id,
      path: '/sys/dict',
      name: 'dict',
      auth: 'sys:dict',
      component: 'views/sys/dict/dict.vue',
      sort: 2,
      status: '0',
      meta: {
        create: {
          title: '字典表',
          icon: 'material-symbols:dictionary-rounded',
          closeTab: true,
        },
      },
      menuBtns: {
        create: [
          { name: '新增字典表', auth: 'sys:dict:create' },
          { name: '删除单个字典表', auth: 'sys:dict:remove' },
          { name: '批量删除字典表', auth: 'sys:dict:removes' }, // SQL ID 173
          { name: '编辑字典表', auth: 'sys:dict:update' },
          { name: '查询字典表列表', auth: 'sys:dict:list' },
          { name: '查询字典表详情', auth: 'sys:dict:detail' },
        ],
      },
    },
  });

  await prisma.sysMenu.create({
    data: {
      parentId: sysRoot.id,
      path: '/sys/dict-detail/:code',
      name: 'dict-detail',
      auth: 'sys:dictDetail',
      hidden: true, // SQL中 hidden 为 1
      component: 'views/sys/dictDetail/dictDetail.vue',
      sort: 2,
      status: '0',
      meta: {
        create: { title: '字典表详情', activeName: 'dict', closeTab: true },
      },
      menuBtns: {
        create: [
          { name: '新增字典表详情', auth: 'sys:dictDetail:create' },
          { name: '删除单个字典表详情', auth: 'sys:dictDetail:remove' },
          { name: '批量删除字典表详情', auth: 'sys:dictDetail:removes' },
          { name: '编辑字典表详情', auth: 'sys:dictDetail:update' },
          { name: '查询字典表详情列表', auth: 'sys:dictDetail:list' },
          { name: '查询字典表详情', auth: 'sys:dictDetail:detail' },
        ],
      },
    },
  });

  await prisma.sysMenu.create({
    data: {
      parentId: sysRoot.id,
      path: '/sys/role',
      name: 'role',
      auth: 'sys:role',
      component: 'views/sys/role/role.vue',
      sort: 1,
      status: '0',
      meta: {
        create: {
          title: '角色管理',
          icon: 'material-symbols:shield-person-rounded',
          closeTab: true,
        },
      },
      menuBtns: {
        create: [
          { name: '新增角色管理', auth: 'sys:role:create' },
          { name: '删除单个角色管理', auth: 'sys:role:remove' },
          { name: '批量删除角色管理', auth: 'sys:role:removes' },
          { name: '编辑角色管理', auth: 'sys:role:update' },
          { name: '查询角色管理列表', auth: 'sys:role:list' },
          { name: '查询角色管理详情', auth: 'sys:role:detail' },
        ],
      },
    },
  });

  await prisma.sysMenu.create({
    data: {
      parentId: sysRoot.id,
      path: '/sys/dept',
      name: 'sys-dept',
      auth: 'sys:dept',
      component: 'views/sys/dept/sysDept.vue',
      sort: 5,
      status: '0',
      meta: {
        create: {
          title: '部门',
          icon: 'mingcute:department-line',
          closeTab: true,
        },
      },
      menuBtns: {
        create: [
          { name: '新增部门', auth: 'sys:dept:create' },
          { name: '单个删除部门', auth: 'sys:dept:remove' },
          { name: '批量删除部门', auth: 'sys:dept:removes' },
          { name: '编辑部门', auth: 'sys:dept:update' },
          { name: '查询部门列表', auth: 'sys:dept:list' },
          { name: '查询部门详情', auth: 'sys:dept:detail' },
        ],
      },
    },
  });

  await prisma.sysMenu.create({
    data: {
      parentId: sysRoot.id,
      path: '/sys/user',
      name: 'user',
      auth: 'sys:user',
      component: 'views/sys/user/user.vue',
      sort: 0,
      status: '0',
      meta: {
        create: {
          title: '用户管理',
          icon: 'ri:user-settings-line',
          closeTab: true,
        },
      },
      menuBtns: {
        create: [
          { name: '新增用户管理', auth: 'sys:user:create' },
          { name: '删除单个用户管理', auth: 'sys:user:remove' },
          { name: '批量删除用户管理', auth: 'sys:user:removes' },
          { name: '编辑用户管理', auth: 'sys:user:update' },
          { name: '查询用户管理列表', auth: 'sys:user:list' },
          { name: '查询用户管理详情', auth: 'sys:user:detail' },
        ],
      },
    },
  });

  await prisma.sysMenu.create({
    data: {
      parentId: sysRoot.id,
      path: '/sys/sys-action-log',
      name: 'sys-action-log',
      auth: 'sys:sys-action-log:list',
      component: 'views/sys/sys-action-log/sysActionLog.vue',
      sort: 5,
      status: '0',
      meta: {
        create: { title: '操作日志', icon: 'ri:blogger-line', closeTab: true },
      },
      menuBtns: {
        create: [
          { name: '查询操作日志列表', auth: 'sys:sys-action-log:list' },
          { name: '查询操作日志详情', auth: 'sys:sys-action-log:detail' },
        ],
      },
    },
  });

  const toolRoot = await prisma.sysMenu.create({
    data: {
      path: '/tool',
      name: 'tool',
      auth: 'tool',
      component: 'views/layout/basic.vue',
      sort: 2,
      status: '0',
      meta: { create: { title: '代码生成', icon: '', closeTab: true } }, // SQL Meta ID 9
    },
  });

  await prisma.sysMenu.create({
    data: {
      parentId: toolRoot.id,
      path: '/tool/temp',
      name: 'temp',
      auth: 'tool:temp',
      component: 'views/tool/temp/temp.vue',
      sort: 0,
      status: '0',
      meta: { create: { title: '模板管理', icon: '', closeTab: true } },
      menuBtns: {
        create: [
          { name: '新增模板管理', auth: 'tool:temp:create' },
          { name: '删除单个模板管理', auth: 'tool:temp:remove' },
          { name: '批量删除模板管理', auth: 'tool:temp:removes' },
          { name: '编辑模板管理', auth: 'tool:temp:update' },
          { name: '查询模板管理列表', auth: 'tool:temp:list' },
          { name: '查询模板管理详情', auth: 'tool:temp:detail' },
        ],
      },
    },
  });

  await prisma.sysMenu.create({
    data: {
      parentId: toolRoot.id,
      path: '/tool/gen',
      name: 'gen',
      auth: 'tool:gen',
      component: 'views/tool/gen/gen.vue',
      sort: 1,
      status: '0',
      meta: { create: { title: '生成代码', icon: '', closeTab: true } },
      menuBtns: {
        create: [
          { name: '新增生成代码', auth: 'tool:gen:create' },
          { name: '删除单个生成代码', auth: 'tool:gen:remove' },
          { name: '批量删除生成代码', auth: 'tool:gen:removes' },
          { name: '编辑生成代码', auth: 'tool:gen:update' },
          { name: '查询生成代码列表', auth: 'tool:gen:list' },
          { name: '查询生成代码详情', auth: 'tool:gen:detail' },
        ],
      },
    },
  });

  await prisma.sysMenu.create({
    data: {
      parentId: toolRoot.id,
      path: '/tool/auto-code',
      name: 'auto-code',
      auth: 'tool:auto-code',
      component: 'views/tool/auto-code/autoCode.vue',
      sort: 5,
      status: '0',
      meta: { create: { title: '生成列表', icon: '', closeTab: true } },
      menuBtns: {
        create: [
          { name: '新增生成列表', auth: 'tool:auto-code:create' },
          { name: '单个删除生成列表', auth: 'tool:auto-code:remove' },
          { name: '批量删除生成列表', auth: 'tool:auto-code:removes' },
          { name: '编辑生成列表', auth: 'tool:auto-code:update' },
          { name: '查询生成列表列表', auth: 'tool:auto-code:list' },
          { name: '查询生成列表详情', auth: 'tool:auto-code:detail' },
        ],
      },
    },
  });

  const uploadRoot = await prisma.sysMenu.create({
    data: {
      path: '/upload',
      name: 'upload',
      auth: 'upload',
      component: 'views/layout/basic.vue',
      sort: 3,
      status: '0',
      meta: {
        create: { title: '附件', icon: 'mingcute:file-line', closeTab: true },
      },
    },
  });

  await prisma.sysMenu.create({
    data: {
      parentId: uploadRoot.id,
      path: '/upload/file',
      name: 'file-upload',
      auth: 'upload:file:list',
      component: 'views/upload/file/fileUpload.vue',
      sort: 5,
      status: '0',
      meta: {
        create: {
          title: '附件上传',
          icon: 'mingcute:folder-upload-line',
          closeTab: true,
        },
      },
      menuBtns: {
        create: [
          { name: '新增附件上传', auth: 'upload:file:create' },
          { name: '单个删除附件上传', auth: 'upload:file:remove' },
          { name: '批量删除附件上传', auth: 'upload:file:removes' },
          { name: '编辑附件上传', auth: 'upload:file:update' },
          { name: '查询附件上传列表', auth: 'upload:file:list' },
          { name: '查询附件上传详情', auth: 'upload:file:detail' },
        ],
      },
    },
  });

  await prisma.sysMenu.create({
    data: {
      path: '/welcome',
      name: 'welcome',
      auth: 'welcome',
      component: 'views/welcome/welcome.vue',
      sort: 0,
      status: '0',
      meta: {
        create: {
          title: '欢迎页面',
          icon: 'material-symbols:digital-wellbeing-outline',
          closeTab: true,
          defaultMenu: true,
        },
      },
    },
  });

  await prisma.sysMenu.create({
    data: {
      path: 'https://jsutil.cn',
      name: 'https://jsutil.cn',
      auth: 'js-util',
      component: '/',
      sort: 0,
      status: '0',
      meta: {
        create: { title: 'js工具库', icon: 'ri:tools-fill', closeTab: true },
      },
    },
  });
}
