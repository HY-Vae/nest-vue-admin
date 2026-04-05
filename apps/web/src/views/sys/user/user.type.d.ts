import type { SysDeptListType } from '@/views/sys/dept/sysDept.type'
import type { SysPostListType } from '@/views/sys/post/post.type'

export interface QueryUserType {
  userName?: string
  nickName?: string
  status?: string
  deptId?: string
  postId?: string
  includeChildren?: boolean
  current?: number
  pageSize?: number
}

export interface UserDeptType {
  id: string
  deptName: string
  sort?: number
  parentId?: string | null
}

export interface UserPostType {
  id: string
  name: string
  isLeader?: boolean
}

export interface UserListType {
  id: string
  userName: string
  avatar: string | null
  email: string | null
  nickName: string
  phone: string | null
  sex: string
  status: string
  userType: string | null
  deptId: string | null
  postId: string | null
  dept?: UserDeptType | null
  post?: UserPostType | null
  remark: string | null
  createBy?: string | null
  createdAt?: Date
  updateBy?: string | null
  updatedAt?: Date
}

export interface UserDetailType extends Omit<UserListType, 'dept' | 'post'> {
  roleIds: string[]
  postId: string | null
  postName: string | null
  dept?: SysDeptListType | null
  post?: SysPostListType | null
}

export interface CreateUserType {
  userName: string
  avatar?: string
  email?: string
  nickName: string
  phone?: string
  sex: string
  status: string
  userType?: string
  deptId?: string | null
  postId?: string | null
  remark?: string
  roleIds: string[]
}

export interface UpdateUserType extends Partial<CreateUserType> {
  id: string
}
