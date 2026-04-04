import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

function generateUUid(): string {
  return uuidv4().replaceAll('-', '');
}

async function main() {
  // 检查是否已有岗位数据
  const existCount = await prisma.sysPost.count();
  if (existCount > 0) {
    console.log('岗位数据已存在，跳过初始化');
    return;
  }

  // 查询部门
  const depts = await prisma.sysDept.findMany();
  const techDept = depts.find(d => d.deptCode === 'TECH');
  const productDept = depts.find(d => d.deptCode === 'PRODUCT');

  const posts: Array<{
    name: string;
    code: string;
    deptId: string | null;
    isLeader: boolean;
    sort: number;
  }> = [
    // 公司通用岗位
    { name: '总经理', code: 'GM', deptId: null, isLeader: true, sort: 1 },
    { name: '副总经理', code: 'VGM', deptId: null, isLeader: true, sort: 2 },
    { name: '总监', code: 'DIRECTOR', deptId: null, isLeader: false, sort: 3 },
    { name: '经理', code: 'MANAGER', deptId: null, isLeader: false, sort: 4 },
    { name: '主管', code: 'SUPERVISOR', deptId: null, isLeader: false, sort: 5 },
    { name: '专员', code: 'STAFF', deptId: null, isLeader: false, sort: 6 },
    { name: '实习生', code: 'INTERN', deptId: null, isLeader: false, sort: 7 },
  ];

  // 技术部岗位
  if (techDept) {
    posts.push(
      { name: '技术总监', code: 'TECH_DIR', deptId: techDept.id, isLeader: true, sort: 1 },
      { name: '技术经理', code: 'TECH_MGR', deptId: techDept.id, isLeader: true, sort: 2 },
      { name: '前端开发工程师', code: 'FE_DEV', deptId: techDept.id, isLeader: false, sort: 3 },
      { name: '后端开发工程师', code: 'BE_DEV', deptId: techDept.id, isLeader: false, sort: 4 },
      { name: '全栈开发工程师', code: 'FULL_DEV', deptId: techDept.id, isLeader: false, sort: 5 },
      { name: '测试工程师', code: 'QA', deptId: techDept.id, isLeader: false, sort: 6 },
      { name: '运维工程师', code: 'OPS', deptId: techDept.id, isLeader: false, sort: 7 },
    );
  }

  // 产品部岗位
  if (productDept) {
    posts.push(
      { name: '产品总监', code: 'PROD_DIR', deptId: productDept.id, isLeader: true, sort: 1 },
      { name: '产品经理', code: 'PROD_MGR', deptId: productDept.id, isLeader: true, sort: 2 },
      { name: '高级产品经理', code: 'PROD_SR', deptId: productDept.id, isLeader: false, sort: 3 },
      { name: '产品专员', code: 'PROD_STAFF', deptId: productDept.id, isLeader: false, sort: 4 },
      { name: 'UI设计师', code: 'UI_DESIGNER', deptId: productDept.id, isLeader: false, sort: 5 },
    );
  }

  // 创建岗位数据
  for (const post of posts) {
    await prisma.sysPost.create({
      data: {
        id: generateUUid(),
        name: post.name,
        code: post.code,
        deptId: post.deptId,
        isLeader: post.isLeader,
        sort: post.sort,
        status: '0',
      },
    });
    console.log(`创建岗位: ${post.name}`);
  }

  console.log(`成功创建 ${posts.length} 个岗位`);
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
