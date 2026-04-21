export interface QueryDictDetailType {
  sysDictCode: string
  label?: string
  value?: string
  status?: string
  page?: number
  size?: number
}

export interface DictDetailListType {
  id: number
  label: string
  value: string
  sort: number
  status: string
  remark: string | null
  sysDictCode: string
  createBy: string
  createdAt: Date
  updateBy: string | null
  updatedAt: Date
}

export interface CreateDictDetailType {
  label: string
  value: string
  sort: number
  status: string
  remark: string | null
  sysDictCode: string
}

export interface UpdateDictDetailType extends Partial<CreateDictDetailType> {
  id: number
}
