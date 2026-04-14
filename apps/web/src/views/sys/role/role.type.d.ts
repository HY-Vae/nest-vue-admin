import type { SelectTreeItem } from '@/types/global.ts'

export interface QueryRoleType {
  name?: string
  key?: string
  status?: string
  page?: number
  size?: number
}

export interface RoleListType {
  id: string
  name: string
  key: string
  sort: number
  status: string
  isSuper: boolean
  dataScope: string
  remark: string | null
  createBy: string
  createdAt: Date
  updateBy: string | null
  updatedAt: Date
}

export interface CreateRoleType {
  name: string
  key: string
  sort: number
  status: string
  isSuper: boolean
  dataScope: string
  remark: string | null
  menus: number[]
  menuBtns: number[]
  deptIds: string[]
}

export interface UpdateRoleType extends Partial<CreateRoleType> {
  id: string
}

export interface PermissionType {
  apiTree: SelectTreeItem[]
  menuTree: SelectTreeItem[]
}
