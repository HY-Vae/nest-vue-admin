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
  parentId: string | null
  sort: number
  status: string
  remark?: string
  createBy?: string
  createdAt?: Date
  updateBy?: string
  updatedAt?: Date
  children?: SysDeptListType[]
}

export interface CreateSysDeptType {
  deptName: string
  deptCode: string
  parentId?: string | null
  sort?: number
  status: string
  remark?: string
}

export interface UpdateSysDeptType extends Partial<CreateSysDeptType> {
  id: string
}
