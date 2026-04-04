import { PrismaClient } from '@prisma/client';
import { generateUUid } from '../index';

const temps = [
  { name: '代码生成', code: 'tool', tempPath: 'modules/tool', createBy: 'nva' },
  { name: '附件上传', code: 'upload', tempPath: 'modules/upload', createBy: 'nva' },
  { name: '系统管理', code: 'sys', tempPath: 'modules/sys', createBy: 'nva' },
];

export async function initTemps(prisma: PrismaClient) {
  console.log('开始初始化模板数据...');
  for (const temp of temps) {
    await prisma.temp.upsert({
      where: { code: temp.code },
      update: {
        name: temp.name,
        tempPath: temp.tempPath,
      },
      create: {
        ...temp,
        id: generateUUid(),
      },
    });
  }
  console.log('模板数据初始化完成');
}
