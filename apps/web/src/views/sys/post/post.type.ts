export interface QuerySysPostType {
  name?: string
  code?: string
  deptId?: string
  status?: string
  current?: number
  pageSize?: number
}

export interface SysPostListType {
  id: string
  name: string
  code: string
  deptId?: string | null
  deptName?: string
  isLeader: boolean
  sort: number
  status: string
  remark?: string
  createBy?: string
  createdAt?: Date
  updateBy?: string
  updatedAt?: Date
}

export interface CreateSysPostType {
  name: string
  code: string
  deptId?: string | null
  isLeader?: boolean
  sort?: number
  status: string
  remark?: string
}

export interface UpdateSysPostType extends Partial<CreateSysPostType> {
  id: string
}
