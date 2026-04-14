import { PrismaClient } from '@prisma/client';
import { generateUUid } from '../index';

// 部门数据（带层级结构和ancestors）
const depts = [
  // 总公司
  { id: '1', deptName: '科技有限公司', deptCode: 'hq', parentId: null, ancestors: '', sort: 0, status: '0', createBy: 'admin' },

  // 一级部门
  { id: '2', deptName: '技术中心', deptCode: 'tech_center', parentId: '1', ancestors: '1', sort: 0, status: '0', createBy: 'admin' },
  { id: '3', deptName: '产品中心', deptCode: 'product_center', parentId: '1', ancestors: '1', sort: 1, status: '0', createBy: 'admin' },
  { id: '4', deptName: '运营中心', deptCode: 'operation_center', parentId: '1', ancestors: '1', sort: 2, status: '0', createBy: 'admin' },
  { id: '5', deptName: '人力资源部', deptCode: 'hr', parentId: '1', ancestors: '1', sort: 3, status: '0', createBy: 'admin' },
  { id: '6', deptName: '财务部', deptCode: 'finance', parentId: '1', ancestors: '1', sort: 4, status: '0', createBy: 'admin' },

  // 技术中心子部门
  { id: '7', deptName: '前端开发组', deptCode: 'frontend', parentId: '2', ancestors: '1,2', sort: 0, status: '0', createBy: 'admin' },
  { id: '8', deptName: '后端开发组', deptCode: 'backend', parentId: '2', ancestors: '1,2', sort: 1, status: '0', createBy: 'admin' },
  { id: '9', deptName: '测试组', deptCode: 'qa', parentId: '2', ancestors: '1,2', sort: 2, status: '0', createBy: 'admin' },
  { id: '10', deptName: '运维组', deptCode: 'devops', parentId: '2', ancestors: '1,2', sort: 3, status: '0', createBy: 'admin' },

  // 产品中心子部门
  { id: '11', deptName: '产品规划组', deptCode: 'product_plan', parentId: '3', ancestors: '1,3', sort: 0, status: '0', createBy: 'admin' },
  { id: '12', deptName: '用户体验组', deptCode: 'ux', parentId: '3', ancestors: '1,3', sort: 1, status: '0', createBy: 'admin' },

  // 运营中心子部门
  { id: '13', deptName: '市场推广组', deptCode: 'marketing', parentId: '4', ancestors: '1,4', sort: 0, status: '0', createBy: 'admin' },
  { id: '14', deptName: '客户服务组', deptCode: 'customer_service', parentId: '4', ancestors: '1,4', sort: 1, status: '0', createBy: 'admin' },
];

export async function initDepts(prisma: PrismaClient) {
  console.log('开始初始化部门数据...');
  for (const dept of depts) {
    await prisma.sysDept.upsert({
      where: { deptCode: dept.deptCode },
      update: {
        deptName: dept.deptName,
        parentId: dept.parentId,
        ancestors: dept.ancestors,
        sort: dept.sort,
        status: dept.status,
      },
      create: {
        id: dept.id,
        deptName: dept.deptName,
        deptCode: dept.deptCode,
        parentId: dept.parentId,
        ancestors: dept.ancestors,
        sort: dept.sort,
        status: dept.status,
        createBy: dept.createBy,
      },
    });
  }
  console.log('部门数据初始化完成');
}

// 导出部门ID供其他模块使用
export const deptIds = {
  hq: '1',
  techCenter: '2',
  productCenter: '3',
  operationCenter: '4',
  hr: '5',
  finance: '6',
  frontend: '7',
  backend: '8',
  qa: '9',
  devops: '10',
  productPlan: '11',
  ux: '12',
  marketing: '13',
  customerService: '14',
};
