import { PrismaClient } from '@prisma/client';
import { initUser } from './initData/sys-user';
import { initMenus } from './initData/sys-menu';
import { initMenuBtns } from './initData/sys-menu-btn';
import { initDicts } from './initData/sys-dict';
const prisma = new PrismaClient();

async function main() {
  await initUser(prisma);
  await initMenus(prisma);
  await initMenuBtns(prisma);
  await initDicts(prisma);
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
