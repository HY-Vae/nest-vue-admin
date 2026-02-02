export interface QueryFileUploadType {
  name?: string

  tag?: string

  mime?: string

  current?: number
  pageSize?: number
}

export interface FileUploadListType {
  id: string

  name: string

  url: string

  tag: string

  key: string

  size: number

  mime: string

  createBy?: string

  createTime?: Date

  updateBy?: string

  updateTime?: Date
}

export interface CreateFileUploadType {}

export interface UpdateFileUploadType extends Partial<CreateFileUploadType> {
  id: string
}
