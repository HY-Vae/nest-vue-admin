export interface CurrentUserType {
  id: string
  userName: string
  avatar: string | null
  email: string | null
  nickName: string
  password: string
  phone: string | null
  sex: string
  status: string
  userType: string | null
  remark: string | null
  createBy: string | null
  createdAt: Date
  updateBy: string | null
  updatedAt: Date
  isSuper: boolean
  permissions: string[]
  dept?: {
    id: string
    deptName: string
    deptCode: string
  }
  post?: {
    id: string
    name: string
    code: string
    isLeader: boolean
  }
}
