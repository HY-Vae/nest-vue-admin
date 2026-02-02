import { SysUser, SysMenu, SysMenuBtn } from '@prisma/client';

export type CustoemUserType = {
  permissions: string[];
  isSuper: boolean;
};

export type CurrentUserType = SysUser & CustoemUserType;

export type JwtPayloadType = {
  id: string;
};
