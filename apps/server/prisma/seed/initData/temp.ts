import { PrismaClient } from '@prisma/client';
import { generateUUid } from '../index';

const temps = [
  { name: '代码生成', code: 'tool', tempPath: 'modules/tool', createBy: 'nva' },
  {
    name: '附件上传',
    code: 'upload',
    tempPath: 'modules/upload',
    createBy: 'nva',
  },
  { name: '系统管理', code: 'sys', tempPath: 'modules/sys', createBy: 'nva' },
];

export async function initTemps(prisma: PrismaClient) {
  console.log('开始初始化模板数据...');
  for (let i = 0; i < temps.length; i++) {
    const temp = temps[i];
    const isExist = await prisma.temp.findFirst({
      where: {
        name: temp.name,
        code: temp.code,
      },
    });
    if (!isExist) {
      await prisma.temp.createMany({
        data: {
          ...temp,
          id: generateUUid(),
        },
      });
    }
  }
}
