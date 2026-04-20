import { PrismaClient } from '@prisma/client';
import { deptIds } from './sys-dept';

// 岗位数据
const posts = [
  // 公司通用岗位
  { id: '1', name: 'CEO', code: 'ceo', deptId: null, isLeader: true, sort: 0, status: '0', createBy: 'admin' },
  { id: '2', name: 'CTO', code: 'cto', deptId: null, isLeader: true, sort: 1, status: '0', createBy: 'admin' },
  { id: '3', name: 'COO', code: 'coo', deptId: null, isLeader: true, sort: 2, status: '0', createBy: 'admin' },
  { id: '4', name: '实习生', code: 'intern', deptId: null, isLeader: false, sort: 99, status: '0', createBy: 'admin' },

  // 技术中心岗位
  { id: '5', name: '技术总监', code: 'tech_director', deptId: deptIds.techCenter, isLeader: true, sort: 0, status: '0', createBy: 'admin' },
  { id: '6', name: '技术经理', code: 'tech_manager', deptId: deptIds.techCenter, isLeader: true, sort: 1, status: '0', createBy: 'admin' },

  // 前端组岗位
  { id: '7', name: '前端组长', code: 'fe_lead', deptId: deptIds.frontend, isLeader: true, sort: 0, status: '0', createBy: 'admin' },
  { id: '8', name: '高级前端工程师', code: 'fe_senior', deptId: deptIds.frontend, isLeader: false, sort: 1, status: '0', createBy: 'admin' },
  { id: '9', name: '前端工程师', code: 'fe_engineer', deptId: deptIds.frontend, isLeader: false, sort: 2, status: '0', createBy: 'admin' },

  // 后端组岗位
  { id: '10', name: '后端组长', code: 'be_lead', deptId: deptIds.backend, isLeader: true, sort: 0, status: '0', createBy: 'admin' },
  { id: '11', name: '高级后端工程师', code: 'be_senior', deptId: deptIds.backend, isLeader: false, sort: 1, status: '0', createBy: 'admin' },
  { id: '12', name: '后端工程师', code: 'be_engineer', deptId: deptIds.backend, isLeader: false, sort: 2, status: '0', createBy: 'admin' },

  // 测试组岗位
  { id: '13', name: '测试组长', code: 'qa_lead', deptId: deptIds.qa, isLeader: true, sort: 0, status: '0', createBy: 'admin' },
  { id: '14', name: '测试工程师', code: 'qa_engineer', deptId: deptIds.qa, isLeader: false, sort: 1, status: '0', createBy: 'admin' },

  // 运维组岗位
  { id: '15', name: '运维组长', code: 'devops_lead', deptId: deptIds.devops, isLeader: true, sort: 0, status: '0', createBy: 'admin' },
  { id: '16', name: '运维工程师', code: 'devops_engineer', deptId: deptIds.devops, isLeader: false, sort: 1, status: '0', createBy: 'admin' },

  // 产品中心岗位
  { id: '17', name: '产品总监', code: 'product_director', deptId: deptIds.productCenter, isLeader: true, sort: 0, status: '0', createBy: 'admin' },
  { id: '18', name: '产品经理', code: 'product_manager', deptId: deptIds.productCenter, isLeader: false, sort: 1, status: '0', createBy: 'admin' },

  // 产品规划组岗位
  { id: '19', name: '规划组长', code: 'plan_lead', deptId: deptIds.productPlan, isLeader: true, sort: 0, status: '0', createBy: 'admin' },
  { id: '20', name: 'UX组长', code: 'ux_lead', deptId: deptIds.ux, isLeader: true, sort: 0, status: '0', createBy: 'admin' },
  { id: '21', name: 'UI设计师', code: 'ui_designer', deptId: deptIds.ux, isLeader: false, sort: 1, status: '0', createBy: 'admin' },

  // 运营中心岗位
  { id: '22', name: '运营总监', code: 'operation_director', deptId: deptIds.operationCenter, isLeader: true, sort: 0, status: '0', createBy: 'admin' },
  { id: '23', name: '市场负责人', code: 'marketing_lead', deptId: deptIds.marketing, isLeader: true, sort: 0, status: '0', createBy: 'admin' },
  { id: '24', name: '市场专员', code: 'marketing_staff', deptId: deptIds.marketing, isLeader: false, sort: 1, status: '0', createBy: 'admin' },
  { id: '25', name: '客服主管', code: 'cs_lead', deptId: deptIds.customerService, isLeader: true, sort: 0, status: '0', createBy: 'admin' },
  { id: '26', name: '客服专员', code: 'cs_staff', deptId: deptIds.customerService, isLeader: false, sort: 1, status: '0', createBy: 'admin' },

  // 人力资源部岗位
  { id: '27', name: 'HR总监', code: 'hr_director', deptId: deptIds.hr, isLeader: true, sort: 0, status: '0', createBy: 'admin' },
  { id: '28', name: 'HR经理', code: 'hr_manager', deptId: deptIds.hr, isLeader: false, sort: 1, status: '0', createBy: 'admin' },
  { id: '29', name: '招聘专员', code: 'recruiter', deptId: deptIds.hr, isLeader: false, sort: 2, status: '0', createBy: 'admin' },

  // 财务部岗位
  { id: '30', name: '财务总监', code: 'finance_director', deptId: deptIds.finance, isLeader: true, sort: 0, status: '0', createBy: 'admin' },
  { id: '31', name: '会计', code: 'accountant', deptId: deptIds.finance, isLeader: false, sort: 1, status: '0', createBy: 'admin' },
  { id: '32', name: '出纳', code: 'cashier', deptId: deptIds.finance, isLeader: false, sort: 2, status: '0', createBy: 'admin' },
];

export async function initPosts(prisma: PrismaClient) {
  console.log('开始初始化岗位数据...');
  for (const post of posts) {
    await prisma.sysPost.upsert({
      where: { code: post.code },
      update: {
        name: post.name,
        deptId: post.deptId,
        isLeader: post.isLeader,
        sort: post.sort,
        status: post.status,
      },
      create: post,
    });
  }
  console.log('岗位数据初始化完成');
}

// 岗位-角色映射
const postRoleMapping: Record<string, string> = {
  // 公司高管 → super_admin
  ceo: 'super_admin',
  cto: 'super_admin',
  coo: 'super_admin',
  // 各部门总监/经理 → tech_admin
  tech_director: 'tech_admin',
  tech_manager: 'tech_admin',
  fe_lead: 'tech_admin',
  be_lead: 'tech_admin',
  qa_lead: 'tech_admin',
  devops_lead: 'tech_admin',
  product_director: 'tech_admin',
  operation_director: 'tech_admin',
  hr_director: 'tech_admin',
  finance_director: 'tech_admin',
  plan_lead: 'tech_admin',
  ux_lead: 'tech_admin',
  marketing_lead: 'tech_admin',
  cs_lead: 'tech_admin',
  // 普通员工/工程师 → normal_user
  fe_senior: 'normal_user',
  fe_engineer: 'normal_user',
  be_senior: 'normal_user',
  be_engineer: 'normal_user',
  qa_engineer: 'normal_user',
  devops_engineer: 'normal_user',
  product_manager: 'normal_user',
  ui_designer: 'normal_user',
  marketing_staff: 'normal_user',
  cs_staff: 'normal_user',
  hr_manager: 'normal_user',
  recruiter: 'normal_user',
  accountant: 'normal_user',
  cashier: 'normal_user',
  intern: 'normal_user',
};

export async function initPostRoles(prisma: PrismaClient) {
  console.log('开始初始化岗位-角色映射...');
  for (const [postCode, roleKey] of Object.entries(postRoleMapping)) {
    const post = await prisma.sysPost.findUnique({ where: { code: postCode } });
    const role = await prisma.sysRole.findUnique({ where: { key: roleKey } });
    if (post && role) {
      await prisma.sysPost.update({
        where: { id: post.id },
        data: {
          roles: { set: [{ id: role.id }] },
        },
      });
    }
  }
  console.log('岗位-角色映射初始化完成');
}
// 导出岗位ID供其他模块使用
export const postIds = {
  ceo: '1',
  cto: '2',
  coo: '3',
  intern: '4',
  techDirector: '5',
  techManager: '6',
  feLead: '7',
  feSenior: '8',
  feEngineer: '9',
  beLead: '10',
  beSenior: '11',
  beEngineer: '12',
  qaLead: '13',
  qaEngineer: '14',
  devopsLead: '15',
  devopsEngineer: '16',
  productDirector: '17',
  productManager: '18',
  planLead: '19',
  uxLead: '20',
  uiDesigner: '21',
  operationDirector: '22',
  marketingLead: '23',
  marketingStaff: '24',
  csLead: '25',
  csStaff: '26',
  hrDirector: '27',
  hrManager: '28',
  recruiter: '29',
  financeDirector: '30',
  accountant: '31',
  cashier: '32',
};
