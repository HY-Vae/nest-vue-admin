export interface QueryUserType {
  userName?: string
  nickName?: string
  status?: string
  page?: number
  size?: number
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
  remark: string | null
  createBy: string | null
  createAt: Date
  updateBy: string | null
  updateAt: Date
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
  remark: string
  roleIds: string[]
}

export interface UpdateUserType extends Partial<CreateUserType> {
  id: string
}
