import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { initDepts } from './initData/sys-dept';
import { initPosts } from './initData/sys-post';
import { initDicts } from './initData/sys-dict';
import { initMenus } from './initData/sys-menu';
import { initUser } from './initData/sys-user';
import { initTemps } from './initData/temp';
import { initMessages } from './initData/sys-message';

const prisma = new PrismaClient();

export function generateUUid(): string {
  return uuidv4().replaceAll('-', '');
}

async function clearData(prisma: PrismaClient) {
  console.log('清理旧数据...');

  // 禁用外键检查
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0');

  // 清空表数据
  await prisma.$executeRawUnsafe('TRUNCATE TABLE sys_action_log');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE sys_user');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE sys_post');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE sys_dept');

  // 启用外键检查
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1');

  console.log('旧数据清理完成');
}

async function main() {
  // 清理旧数据
  await clearData(prisma);

  // 注意顺序：先部门，再岗位，最后用户
  await initDepts(prisma);
  await initPosts(prisma);
  await initUser(prisma);
  await initMenus(prisma);
  await initDicts(prisma);
  await initTemps(prisma);
  await initMessages(prisma);

  console.log('\n✅ 所有测试数据初始化完成！');
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
