import { PrismaClient } from '@prisma/client';
import { generateUUid } from '../index';

const roles = [
  {
    name: '超级管理员',
    key: 'super_admin',
    sort: 0,
    status: '0',
    isSuper: true,
    dataScope: 'ALL',
    remark: '拥有系统所有权限',
    createBy: 'admin',
  },
  {
    name: '技术管理员',
    key: 'tech_admin',
    sort: 1,
    status: '0',
    isSuper: false,
    dataScope: 'DEPT_AND_CHILD',
    remark: '技术中心管理员，可管理技术中心及下属部门数据',
    createBy: 'admin',
  },
  {
    name: '普通用户',
    key: 'normal_user',
    sort: 2,
    status: '0',
    isSuper: false,
    dataScope: 'SELF',
    remark: '普通用户，只能查看自己的数据',
    createBy: 'admin',
  },
];

export async function initRoles(prisma: PrismaClient) {
  console.log('开始初始化角色数据...');
  for (const role of roles) {
    await prisma.sysRole.upsert({
      where: { key: role.key },
      update: {
        name: role.name,
        sort: role.sort,
        status: role.status,
        isSuper: role.isSuper,
        dataScope: role.dataScope,
        remark: role.remark,
      },
      create: {
        id: generateUUid(),
        ...role,
      },
    });
  }
  console.log('角色数据初始化完成');
}
