import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 查找系统管理菜单的ID
  const sysRoot = await prisma.sysMenu.findFirst({
    where: { name: 'sys', parentId: null }
  });

  if (!sysRoot) {
    console.error('未找到系统管理菜单');
    return;
  }

  console.log('找到系统管理菜单 ID:', sysRoot.id);

  // 检查岗位管理菜单是否已存在
  const existPostMenu = await prisma.sysMenu.findFirst({
    where: { name: 'sys-post' }
  });

  if (existPostMenu) {
    console.log('岗位管理菜单已存在');
    return;
  }

  // 创建岗位管理菜单
  const postMenu = await prisma.sysMenu.create({
    data: {
      parentId: sysRoot.id,
      path: '/sys/post',
      name: 'sys-post',
      auth: 'sys:post',
      component: 'views/sys/post/post.vue',
      sort: 6,
      status: '0',
      meta: {
        create: {
          title: '岗位管理',
          icon: 'ri:user-star-line',
          closeTab: true,
        },
      },
      menuBtns: {
        create: [
          { name: '新增岗位', auth: 'sys:post:create' },
          { name: '单个删除岗位', auth: 'sys:post:remove' },
          { name: '编辑岗位', auth: 'sys:post:update' },
          { name: '查询岗位列表', auth: 'sys:post:list' },
          { name: '查询岗位详情', auth: 'sys:post:detail' },
        ],
      },
    },
  });

  console.log('岗位管理菜单创建成功:', postMenu.id);

  // 给 admin 角色分配岗位管理权限
  const adminRole = await prisma.sysRole.findFirst({
    where: { key: 'admin' }
  });

  if (adminRole) {
    // 获取刚创建的菜单按钮
    const menuBtns = await prisma.sysMenuBtn.findMany({
      where: { sysMenuId: postMenu.id }
    });

    // 关联到 admin 角色
    await prisma.sysRole.update({
      where: { id: adminRole.id },
      data: {
        menus: { connect: [{ id: postMenu.id }] },
        menuBtns: { connect: menuBtns.map(btn => ({ id: btn.id })) }
      }
    });

    console.log('已为 admin 角色分配岗位管理权限');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
