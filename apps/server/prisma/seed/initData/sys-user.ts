import { PrismaClient } from '@prisma/client';

const users = [
  {
    id: '1',
    userName: 'admin',
    avatar: null,
    email: null,
    nickName: 'nva',
    password: '$2b$10$KTXfR37g00JCSvByd89Cx.zoUn4.vsICmMWWgUh26Qzscx4F4sCnG',
    phone: null,
    sex: '0',
    status: '0',
    userType: null,
    remark: null,
  },
];

export async function initUser(prisma: PrismaClient) {
  // 查询是否存在如果存在就跳过
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const isExist = await prisma.sysUser.findFirst({
      where: {
        userName: user.userName,
      },
    });
    if (!isExist) {
      await prisma.sysUser.create({
        data: user,
      });
    }
  }
}
