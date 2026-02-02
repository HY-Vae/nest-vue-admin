export interface QueryAutoCodeType {
  name?: string

  nameZh?: string

  tempId?: string

  current?: number
  pageSize?: number
}

export interface AutoCodeListType {
  id: string

  name: string

  nameZh: string

  modelName: string

  webPath: string

  tempId: string

  routePath: string

  fields: string

  createBy?: string

  createTime?: Date

  updateBy?: string

  updateTime?: Date
}

export interface CreateAutoCodeType {
  name: string

  nameZh: string

  modelName: string

  webPath: string

  tempId: string

  routePath: string

  fields: string
}

export interface UpdateAutoCodeType extends Partial<CreateAutoCodeType> {
  id: string
}
