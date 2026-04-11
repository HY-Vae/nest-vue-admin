/* 登录日志列表项 */
export interface SysLoginLogListType {
  id: number
  userName: string
  userId: string | null
  ip: string | null
  location: string | null
  browser: string | null
  os: string | null
  status: string
  message: string | null
  createdAt: string
}

/* 查询参数 */
export interface QuerySysLoginLogType {
  current: number
  pageSize: number
  userName?: string
  ip?: string
  location?: string
  status?: string
  startTime?: string
  endTime?: string
}
