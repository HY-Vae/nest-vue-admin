import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 查找用户管理菜单的ID
  const userMenu = await prisma.sysMenu.findFirst({
    where: { name: 'user' }
  });

  if (!userMenu) {
    console.error('未找到用户管理菜单');
    return;
  }

  // 检查组织架构菜单是否已存在
  const existOrgMenu = await prisma.sysMenu.findFirst({
    where: { name: 'org-user' }
  });

  if (existOrgMenu) {
    console.log('组织架构菜单已存在');
    return;
  }

  // 创建组织架构菜单
  const orgMenu = await prisma.sysMenu.create({
    data: {
      parentId: userMenu.parentId,
      path: '/sys/org-user',
      name: 'org-user',
      auth: 'sys:user:list',
      component: 'views/sys/user/orgUser.vue',
      sort: 0,
      status: '0',
      hidden: true,
      meta: {
        create: {
          title: '组织架构',
          activeName: 'user',
          closeTab: true,
        },
      },
    },
  });

  console.log('组织架构菜单创建成功:', orgMenu.id);
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
