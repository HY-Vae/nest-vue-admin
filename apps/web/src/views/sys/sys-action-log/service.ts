import type { ListResult } from '@/types/global.ts'
import request from '@/utils/request.ts'
import type { QuerySysActionLogType, SysActionLogListType } from './sysActionLog.type'

export function getSysActionLogApi(
  params: QuerySysActionLogType,
): Promise<ListResult<SysActionLogListType>> {
  return request('/sys/sys-action-log', {
    method: 'GET',
    params,
  })
}
