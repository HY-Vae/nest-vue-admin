import type { ListResult, Result } from '@/types/global.ts'
import request from '@/utils/request.ts'
import type {
  AutoCodeListType,
  CreateAutoCodeType,
  QueryAutoCodeType,
  UpdateAutoCodeType,
} from './autoCode.type'

export function getAutoCodeApi(params: QueryAutoCodeType): Promise<ListResult<AutoCodeListType>> {
  return request('/tool/auto-code', {
    method: 'GET',
    params,
  })
}

export function getAutoCodeOneApi(id: string): Promise<Result<AutoCodeListType>> {
  return request(`/tool/auto-code/${id}`, {
    method: 'GET',
  })
}

export function addAutoCodeApi(data: CreateAutoCodeType): Promise<Result> {
  return request('/tool/auto-code', {
    method: 'POST',
    data,
  })
}

export function updateAutoCodeApi(data: UpdateAutoCodeType): Promise<Result> {
  return request(`/tool/auto-code/${data.id}`, {
    method: 'PATCH',
    data,
  })
}

export function deleteAutoCodeApi(id: string): Promise<Result> {
  return request(`/tool/auto-code/${id}`, {
    method: 'DELETE',
  })
}

export function deleteAutoCodesApi(ids: string[]): Promise<Result> {
  return request(`/tool/auto-code`, {
    method: 'DELETE',
    data: {
      ids,
    },
  })
}
