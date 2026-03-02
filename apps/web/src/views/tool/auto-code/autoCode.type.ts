export interface QueryAutoCodeType {
  name?: string

  nameZh?: string

  tempId?: string

  current?: number
  pageSize?: number
}

export interface AutoCodeListType {
  id: number

  name: string

  nameZh: string

  modelName: string

  webPath: string

  tempId: string

  routePath: string

  fields: string

  createBy?: string

  createdAt?: Date

  updateBy?: string

  updatedAt?: Date
}
