import request from '@/utils/request.ts'
import type { ListResult, Result, SelectOptionItem } from '@/types/global.ts'
import type {
  CreateDictType,
  QueryDictType,
  DictListType,
  UpdateDictType,
} from '@/views/sys/dict/dict.type'

export function getDictApi(params: QueryDictType): Promise<ListResult<DictListType>> {
  return request('/sys/dict', {
    method: 'GET',
    params,
  })
}

export function getDictOptionsApi(): Promise<Result<SelectOptionItem[]>> {
  return request('/sys/dict/options', {
    method: 'GET',
  })
}

export function getDictOneApi(code: string): Promise<Result<DictListType>> {
  return request(`/sys/dict/${code}`, {
    method: 'GET',
  })
}

export function getDictsApi(codes: string[]): Promise<Result<DictListType>> {
  return request(`/sys/dict/options`, {
    method: 'post',
    data: {
      codes,
    },
  })
}

export function addDictApi(data: CreateDictType): Promise<Result> {
  return request('/sys/dict', {
    method: 'POST',
    data,
  })
}

export function updateDictApi(data: UpdateDictType): Promise<Result> {
  return request(`/sys/dict/${data.id}`, {
    method: 'PATCH',
    data,
  })
}

export function deleteDictApi(ids: string[]): Promise<Result> {
  return request(`/sys/dict`, {
    method: 'DELETE',
    data: {
      ids,
    },
  })
}
