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
  createdAt: Date
  updateBy: string | null
  updatedAt: Date
}

export interface CreateTempType {
  name: string
  code: string
  tempPath: string
}

export interface UpdateTempType extends Partial<CreateTempType> {
  id: string
}
