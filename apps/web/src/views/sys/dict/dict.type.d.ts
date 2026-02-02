import type { DictDetailListType } from '@/views/sys/dictDetail/dictDetail.type'

export interface QueryDictType {
  name?: string
  code?: string
  status?: string
  page?: number
  size?: number
}

export interface DictListType {
  id: string
  name: string
  code: string
  sort: number
  status: string
  remark: string | null
  createBy: string
  createAt: Date
  updateBy: string | null
  updateAt: Date
  details: DictDetailListType[]
}

export interface CreateDictType {
  name: string
  code: string
  sort: number
  status: string
  remark: string | null
}

export interface UpdateDictType extends Partial<CreateDictType> {
  id: string
}
