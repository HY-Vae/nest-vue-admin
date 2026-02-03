import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { initDepts } from './initData/sys-dept';
import { initDicts } from './initData/sys-dict';
import { initMenus } from './initData/sys-menu';
import { initUser } from './initData/sys-user';
import { initTemps } from './initData/temp';
const prisma = new PrismaClient();
export function generateUUid(): string {
  return uuidv4().replaceAll('-', '');
}
async function main() {
  await initUser(prisma);
  await initMenus(prisma);
  await initDicts(prisma);
  await initDepts(prisma);
  await initTemps(prisma);
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
