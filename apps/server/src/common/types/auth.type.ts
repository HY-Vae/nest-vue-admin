import { SysDept, SysPost, SysUser } from '@prisma/client';

/**
 * 数据权限解析后的 Prisma where 条件
 * - {}             不限制（ALL / 超管）
 * - { createBy }   仅本人
 * - { deptId }     按部门（DEPT / DEPT_AND_CHILD / CUSTOM）
 */
export type DataScopeWhere =
  | Record<string, never>
  | { createBy: string }
  | { deptId: { in: string[] } };

export type CustoemUserType = {
  permissions: string[];
  isSuper: boolean;
  dept?: Pick<SysDept, 'id' | 'deptName' | 'deptCode'> | null;
  post?: SysPost | null;
  dataScope: DataScopeWhere;
};

export type CurrentUserType = Omit<SysUser, 'dept' | 'post'> & CustoemUserType;

export type JwtPayloadType = {
  id: string;
};
