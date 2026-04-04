import { PrismaClient } from '@prisma/client';

interface DictDetail {
  label: string;
  value: string;
  sort: number;
  status: string;
  remark?: string;
  createBy: string;
}

interface Dict {
  name: string;
  code: string;
  sort: number;
  status: string;
  remark?: string;
  createBy: string;
  details: DictDetail[];
}

const dicts: Dict[] = [
  {
    name: '启用状态',
    code: 'enableStatus',
    sort: 0,
    status: '0',
    remark: '',
    createBy: 'nva',
    details: [
      { label: '已启用', value: '0', sort: 0, status: '0', remark: '', createBy: 'nva' },
      { label: '已停用', value: '1', sort: 1, status: '0', remark: '', createBy: 'nva' },
    ],
  },
  {
    name: '性别',
    code: 'sexStatus',
    sort: 1,
    status: '0',
    createBy: 'nva',
    details: [
      { label: '男', value: '0', sort: 0, status: '0', createBy: 'nva' },
      { label: '女', value: '1', sort: 1, status: '0', createBy: 'nva' },
    ],
  },
  {
    name: '请求结果',
    code: 'requestStatus',
    sort: 3,
    status: '0',
    createBy: 'nva',
    details: [
      { label: '请求成功', value: '0', sort: 0, status: '0', createBy: 'nva' },
      { label: '请求失败', value: '1', sort: 1, status: '0', createBy: 'nva' },
    ],
  },
];

export async function initDicts(prisma: PrismaClient) {
  console.log('开始初始化字典数据...');
  for (const dict of dicts) {
    const { details, ...dictData } = dict;

    await prisma.sysDict.upsert({
      where: { code: dict.code },
      update: {
        name: dictData.name,
        sort: dictData.sort,
        status: dictData.status,
        remark: dictData.remark ?? null,
      },
      create: {
        name: dictData.name,
        code: dictData.code,
        sort: dictData.sort,
        status: dictData.status,
        remark: dictData.remark ?? null,
        createBy: dictData.createBy,
      },
    });

    // 处理字典详情
    for (const detail of details) {
      await prisma.sysDictDetail.upsert({
        where: {
          value_sysDictCode: {
            value: detail.value,
            sysDictCode: dict.code,
          },
        },
        update: {
          label: detail.label,
          sort: detail.sort,
          status: detail.status,
          remark: detail.remark ?? null,
        },
        create: {
          label: detail.label,
          value: detail.value,
          sort: detail.sort,
          status: detail.status,
          remark: detail.remark ?? null,
          sysDictCode: dict.code,
          createBy: detail.createBy,
        },
      });
    }
  }
  console.log('字典数据初始化完成');
}
