// 组织架构用户页面的类型定义

export interface OrgDeptTreeType {
  id: string
  deptName: string
  deptCode: string
  parentId: string | null
  sort: number
  status: string
  userCount?: number
  totalUserCount?: number
  children?: OrgDeptTreeType[]
}

export interface OrgPostListType {
  id: string
  name: string
  code: string
  deptId?: string | null
  deptName?: string
  isLeader: boolean
  sort: number
  status: string
  userCount?: number
}

export interface OrgQueryUserType {
  deptId?: string
  postId?: string
  userName?: string
  status?: string
  current?: number
  pageSize?: number
}

export interface OrgUserListType {
  id: string
  userName: string
  nickName: string
  avatar: string | null
  phone: string | null
  email: string | null
  status: string
  deptId: string | null
  deptName?: string | null
  postId: string | null
  postName?: string | null
  createdAt?: Date
}
