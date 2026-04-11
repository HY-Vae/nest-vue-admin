import type { ListResult, Result } from '@/types/global.ts'
import request from '@/utils/request.ts'
import type { QuerySysLoginLogType, SysLoginLogListType } from './loginLog.type'

/* 查询登录日志列表 */
export function getLoginLogApi(params: QuerySysLoginLogType): Promise<ListResult<SysLoginLogListType>> {
  return request('/sys/login-log', {
    method: 'GET',
    params,
  })
}

/* 查询登录日志详情 */
export function getLoginLogOneApi(id: number): Promise<Result<SysLoginLogListType>> {
  return request(`/sys/login-log/${id}`, {
    method: 'GET',
  })
}

/* 批量删除登录日志 */
export function batchDeleteLoginLogApi(ids: number[]): Promise<Result> {
  return request('/sys/login-log', {
    method: 'DELETE',
    params: { ids },
  })
}

/* 清空登录日志 */
export function clearLoginLogApi(): Promise<Result> {
  return request('/sys/login-log/clear', {
    method: 'DELETE',
  })
}
