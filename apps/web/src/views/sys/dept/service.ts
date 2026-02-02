import type { ListResult, Result } from '@/types/global.ts'
import request from '@/utils/request.ts'
import type {
  CreateSysDeptType,
  QuerySysDeptType,
  SysDeptListType,
  UpdateSysDeptType,
} from './sysDept.type.ts'

export function getSysDeptApi(params: QuerySysDeptType): Promise<ListResult<SysDeptListType>> {
  return request('/sys/dept', {
    method: 'GET',
    params,
  })
}

export function getSysDeptOneApi(id: string): Promise<Result<SysDeptListType>> {
  return request(`/sys/dept/${id}`, {
    method: 'GET',
  })
}

export function addSysDeptApi(data: CreateSysDeptType): Promise<Result> {
  return request('/sys/dept', {
    method: 'POST',
    data,
  })
}

export function updateSysDeptApi(data: UpdateSysDeptType): Promise<Result> {
  return request(`/sys/dept/${data.id}`, {
    method: 'PATCH',
    data,
  })
}

export function deleteSysDeptApi(id: string): Promise<Result> {
  return request(`/sys/dept/${id}`, {
    method: 'DELETE',
  })
}

export function deleteSysDeptsApi(ids: string[]): Promise<Result> {
  return request(`/sys/dept`, {
    method: 'DELETE',
    data: {
      ids,
    },
  })
}
