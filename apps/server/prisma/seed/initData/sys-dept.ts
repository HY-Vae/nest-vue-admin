import { PrismaClient } from '@prisma/client';
import { generateUUid } from '../index';

const depts = [
  { deptName: '财务部', deptCode: 'finance', status: '0', createBy: 'nva' },
  { deptName: '技术部', deptCode: 'technical', status: '0', createBy: 'nva' },
];

export async function initDepts(prisma: PrismaClient) {
  console.log('开始初始化部门数据...');
  for (let i = 0; i < depts.length; i++) {
    const dept = depts[i];
    const isExist = await prisma.sysDept.findFirst({
      where: {
        deptName: dept.deptName,
        deptCode: dept.deptCode,
      },
    });
    if (!isExist) {
      await prisma.sysDept.createMany({
        data: {
          ...dept,
          id: generateUUid(),
        },
      });
    }
  }
}
