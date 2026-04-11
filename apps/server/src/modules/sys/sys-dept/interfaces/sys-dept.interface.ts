import { SysDept } from '@prisma/client';

/* 部门树节点 */
export interface DeptTreeNode extends Partial<SysDept> {
  children: DeptTreeNode[];
  userCount: number;
  totalUserCount?: number;
  leaders: { id: string; name: string }[];
  leaderName: string | null;
}

/* 组织架构树节点 */
export interface OrgTreeNode {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  sort: number;
  status: string;
  userCount: number;
  totalUserCount?: number;
  nodeType: 'dept' | 'post';
  isLeader?: boolean;
  isCommon?: boolean;
  children: OrgTreeNode[];
}

/* 带用户数量的部门类型 */
export interface DeptWithUserCount extends SysDept {
  userCount: number;
  leaders: { id: string; name: string }[];
  leaderName: string | null;
}

/* 岗位节点（用于组织架构树） */
export interface PostNode {
  id: string;
  name: string;
  code: string;
  isLeader: boolean;
  sort: number | null;
  userCount: number;
  nodeType: 'post';
  isCommon?: boolean;
}

/* 带岗位的部门节点（用于构建组织架构树） */
export interface DeptWithPosts {
  id: string;
  deptName: string;
  deptCode: string;
  parentId: string | null;
  sort: number;
  status: string;
  userCount: number;
  nodeType: 'dept';
  posts: PostNode[];
}
