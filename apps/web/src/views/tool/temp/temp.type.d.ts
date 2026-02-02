export interface QueryTempType {
  name?: string
  code?: string
  page?: number
  size?: number
}

export interface TempListType {
  id: string
  name: string
  code: string
  tempPath: string
  createBy: string
  createAt: Date
  updateBy: string | null
  updateAt: Date
}

export interface CreateTempType {
  name: string
  code: string
  tempPath: string
}

export interface UpdateTempType extends Partial<CreateTempType> {
  id: string
}
