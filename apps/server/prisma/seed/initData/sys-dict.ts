import { PrismaClient } from '@prisma/client';

const dicts = [
  {
    name: '启用状态',
    code: 'enableStatus',
    sort: 0,
    status: '0',
    remark: '',
    createBy: 'nva',
    createAt: '2025-11-05T07:28:00.275Z',
    updateBy: null,
    updateAt: '2025-11-05T07:28:00.275Z',
    details: [
      {
        label: '已启用',
        value: '0',
        sort: 0,
        status: '0',
        remark: '',
        sysDictCode: 'enableStatus',
        createBy: 'nva',
        createAt: '2025-11-05T07:28:21.648Z',
        updateBy: null,
        updateAt: '2025-11-05T07:28:21.648Z',
      },
      {
        label: '已停用',
        value: '1',
        sort: 1,
        status: '0',
        remark: '',
        sysDictCode: 'enableStatus',
        createBy: 'nva',
        createAt: '2025-11-05T07:28:36.039Z',
        updateBy: null,
        updateAt: '2025-11-05T07:28:36.039Z',
      },
    ],
  },
];

export async function initDicts(prisma: PrismaClient) {
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
