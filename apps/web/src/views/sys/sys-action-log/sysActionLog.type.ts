export interface QuerySysActionLogType {
  title?: string
  action?: string
  ip?: string
  address?: string
  userName?: string
  status?: string
  current?: number
  pageSize?: number
}

export interface SysActionLogListType {
  id: number
  title?: string
  action?: string
  method?: string
  ip?: string
  address?: string
  userId?: string
  userName?: string
  params?: string
  result?: string
  errorInfo?: string
  status?: string
  createBy?: string
  createdAt?: Date
  updateBy?: string
  updatedAt?: Date
}
