import { SysDept, SysPost, SysUser } from '@prisma/client';

export type CustoemUserType = {
  permissions: string[];
  isSuper: boolean;
  dept?: Pick<SysDept, 'id' | 'deptName' | 'deptCode'> | null;
  post?: SysPost | null;
};

export type CurrentUserType = Omit<SysUser, 'dept' | 'post'> & CustoemUserType;

export type JwtPayloadType = {
  id: string;
};
