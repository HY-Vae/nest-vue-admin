export interface QueryNoticeType {
  title?: string
  type?: string
  status?: string
  current?: number
  pageSize?: number
}

export interface NoticeListType {
  id: string
  title: string
  content: string
  type: string
  status: string
  createBy: string | null
  createdAt: Date
  updateBy: string | null
  updatedAt: Date
  isRead?: boolean
  readAt?: Date | null
}

export interface CreateNoticeType {
  title: string
  content: string
  type?: string
  status?: string
}

export interface UpdateNoticeType extends Partial<CreateNoticeType> {
  id: string
}
