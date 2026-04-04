export interface QueryUserType {
  userName?: string
  nickName?: string
  status?: string
  deptId?: string
  postId?: string
  current?: number
  pageSize?: number
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
  postName?: string | null
  remark: string | null
  createBy?: string | null
  createdAt?: Date
  updateBy?: string | null
  updatedAt?: Date
}

export interface UserDetailType extends UserListType {
  roleIds: string[]
  id?: string
}

export interface CreateUserType {
  userName: string
  avatar: string
  email: string
  nickName: string
  phone: string
  sex: string
  status: string
  userType: string
  deptId?: string | null
  postId?: string | null
  remark: string
  roleIds: string[]
}

export interface UpdateUserType extends Partial<CreateUserType> {
  id: string
}
