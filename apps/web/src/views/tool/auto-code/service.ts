import type { ListResult, Result } from '@/types/global.ts'
import request from '@/utils/request.ts'
import type { AutoCodeListType, QueryAutoCodeType } from './autoCode.type'

export function getAutoCodeApi(params: QueryAutoCodeType): Promise<ListResult<AutoCodeListType>> {
  return request('/tool/auto-code', {
    method: 'GET',
    params,
  })
}

export function deleteAutoCodeApi(id: number): Promise<Result> {
  return request(`/tool/auto-code/${id}`, {
    method: 'DELETE',
  })
}
