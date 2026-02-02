import request from '@/utils/request.ts'
import type { ListResult, Result } from '@/types/global.ts'
import type {
  CreateTempType,
  QueryTempType,
  TempListType,
  UpdateTempType,
} from '@/views/tool/temp/temp.type'

export function getTempApi(params: QueryTempType): Promise<ListResult<TempListType>> {
  return request('/tool/temp', {
    method: 'GET',
    params,
  })
}

export function getTempOptionsApi(): Promise<Result<TempListType[]>> {
  return request('/tool/temp/options', {
    method: 'GET',
  })
}

export function getTempOneApi(code: string): Promise<Result<TempListType>> {
  return request(`/tool/temp/${code}`, {
    method: 'GET',
  })
}

export function addTempApi(data: CreateTempType): Promise<Result> {
  return request('/tool/temp', {
    method: 'POST',
    data,
  })
}

export function updateTempApi(data: UpdateTempType): Promise<Result> {
  return request(`/tool/temp/${data.id}`, {
    method: 'PATCH',
    data,
  })
}

export function deleteTempApi(id: string): Promise<Result> {
  return request(`/tool/temp/${id}`, {
    method: 'DELETE',
  })
}

export function deleteTempApis(ids: string[]): Promise<Result> {
  return request(`/tool/temp`, {
    method: 'DELETE',
    data: {
      ids,
    },
  })
}
