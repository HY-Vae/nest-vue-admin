import type { ListResult, Result } from '@/types/global.ts'
import request from '@/utils/request.ts'
import type {
  CreateDictDetailType,
  DictDetailListType,
  QueryDictDetailType,
  UpdateDictDetailType,
} from '@/views/sys/dictDetail/dictDetail.type'

export function getDictDetailApi(
  params: QueryDictDetailType,
): Promise<ListResult<DictDetailListType>> {
  return request('/sys/dictDetail', {
    method: 'GET',
    params,
  })
}

export function getDictDetailOneApi(id: number): Promise<Result<DictDetailListType>> {
  return request(`/sys/dictDetail/${id}`, {
    method: 'GET',
  })
}

export function addDictDetailApi(data: CreateDictDetailType): Promise<Result> {
  return request('/sys/dictDetail', {
    method: 'POST',
    data,
  })
}

export function updateDictDetailApi(data: UpdateDictDetailType): Promise<Result> {
  return request(`/sys/dictDetail/${data.id}`, {
    method: 'PATCH',
    data,
  })
}

export function deleteDictDetailApi(id: number, sysDictCode: string): Promise<Result> {
  return request(`/sys/dictDetail/${id}`, {
    method: 'DELETE',
    data: {
      sysDictCode,
    },
  })
}

export function deleteDictDetailsApi(ids: number[], sysDictCode: string): Promise<Result> {
  return request(`/sys/dictDetail`, {
    method: 'DELETE',
    data: {
      ids,
      sysDictCode,
    },
  })
}
