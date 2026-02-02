import type { SelectTreeItem } from '@/types/global.ts'

export interface QueryMenuType {
  name?: string
  key?: string
  status?: string
  page?: number
  size?: number
}

export interface MenuListType {
  id: number
  parentId: number
  name: string
  path: string
  auth: string
  hidden: boolean
  component: string
  status: string
  sort: number
  remark: string | null
  meta: CreateMenuMetaType
  createBy: string
  createAt: Date
  updateBy: string | null
  updateAt: Date
  children: MenuListType[]
}

export interface CreateMenuMetaType {
  activeName?: string
  keepAlive: boolean
  defaultMenu: boolean
  title: string
  closeTab: boolean
  icon?: string
}

export interface CreateMenuBtnType {
  name: string
  auth: string
  id?: number
}

export interface CreateMenuType {
  parentId: number
  name: string
  path: string
  auth: string
  hidden: boolean
  component: string
  status: string
  sort: number
  remark: string | null
  meta: CreateMenuMetaType
  menuBtns: CreateMenuBtnType[]
}

export interface UpdateMenuType extends Partial<CreateMenuType> {
  id: string
}

export interface IconifyResult {
  prefix: string
  total: number
  title: string
  categories: { [key: string]: string[] }
  hidden: string[]
  aliases: { [key: string]: string }
  suffixes: Suffixes
}

export interface IconResult {
  icons: string[]
  total: number
}
