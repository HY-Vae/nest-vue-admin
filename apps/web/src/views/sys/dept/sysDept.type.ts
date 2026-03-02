export interface QuerySysDeptType {
  deptName?: string

  deptCode?: string

  status?: string

  current?: number
  pageSize?: number
}

export interface SysDeptListType {
  id: string

  deptName: string

  deptCode: string

  status: string

  createBy?: string

  createdAt?: Date

  updateBy?: string

  updatedAt?: Date
}

export interface CreateSysDeptType {
  deptName: string

  deptCode: string

  status: string
}

export interface UpdateSysDeptType extends Partial<CreateSysDeptType> {
  id: string
}
