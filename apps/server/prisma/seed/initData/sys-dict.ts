import { PrismaClient } from '@prisma/client';

const dicts = [
  {
    name: '启用状态',
    code: 'enableStatus',
    sort: 0,
    status: '0',
    remark: '',
    createBy: 'nva',
    details: [
      {
        label: '已启用',
        value: '0',
        sort: 0,
        status: '0',
        remark: '',
        sysDictCode: 'enableStatus',
        createBy: 'nva',
        updateBy: null,
      },
      {
        label: '已停用',
        value: '1',
        sort: 1,
        status: '0',
        remark: '',
        sysDictCode: 'enableStatus',
        createBy: 'nva',
        updateBy: null,
      },
    ],
  },
  {
    name: '性别',
    code: 'sexStatus',
    sort: 1,
    status: '0',
    createBy: 'nva',
    details: [
      {
        label: '男',
        value: '0',
        sort: 0,
        status: '0',
        sysDictCode: 'sexStatus',
        createBy: 'nva',
      },
      {
        label: '女',
        value: '1',
        sort: 1,
        status: '0',
        sysDictCode: 'sexStatus',
        createBy: 'nva',
      },
    ],
  },
  {
    name: '请求结果',
    code: 'requestStatus',
    sort: 3,
    status: '0',
    createBy: 'nva',
    details: [
      {
        label: '请求成功',
        value: '0',
        sort: 0,
        status: '0',
        sysDictCode: 'requestStatus',
        createBy: 'nva',
      },
      {
        label: '请求失败',
        value: '1',
        sort: 1,
        status: '0',
        sysDictCode: 'requestStatus',
        createBy: 'nva',
      },
    ],
  },
];

export async function initDicts(prisma: PrismaClient) {
  console.log('开始初始化字典数据...');
  for (let i = 0; i < dicts.length; i++) {
    const dict = dicts[i];
    const isExist = await prisma.sysDict.findFirst({
      where: {
        code: dict.code,
      },
    });
    if (!isExist) {
      const { details, ...other } = dict;
      await prisma.sysDict.create({
        data: {
          ...other,
        },
      });
      for (let j = 0; j < details.length; j++) {
        const detail = details[j];
        const isExist = await prisma.sysDictDetail.findFirst({
          where: {
            value: detail.value,
            sysDictCode: dict.code,
          },
        });
        if (!isExist) {
          await prisma.sysDictDetail.create({
            data: {
              ...detail,
            },
          });
        }
      }
    }
  }
}
