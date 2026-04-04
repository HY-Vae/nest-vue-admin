import type { ListResult, Result, SelectOptionItem } from '@/types/global.ts'
import request from '@/utils/request.ts'
import type {
  CreateSysPostType,
  QuerySysPostType,
  SysPostListType,
  UpdateSysPostType,
} from './post.type'

export function getSysPostApi(params: QuerySysPostType): Promise<ListResult<SysPostListType>> {
  return request('/sys/post', {
    method: 'GET',
    params,
  })
}

export function getSysPostOneApi(id: string): Promise<Result<SysPostListType>> {
  return request(`/sys/post/${id}`, {
    method: 'GET',
  })
}

export function addSysPostApi(data: CreateSysPostType): Promise<Result> {
  return request('/sys/post', {
    method: 'POST',
    data,
  })
}

export function updateSysPostApi(data: UpdateSysPostType): Promise<Result> {
  return request(`/sys/post/${data.id}`, {
    method: 'PATCH',
    data,
  })
}

export function deleteSysPostApi(id: string): Promise<Result> {
  return request(`/sys/post/${id}`, {
    method: 'DELETE',
  })
}

export function batchDeleteSysPostApi(ids: string[]): Promise<Result> {
  return request('/sys/post/batch', {
    method: 'DELETE',
    data: { ids },
  })
}

// 获取岗位选项列表（用于下拉选择）
export function getSysPostOptionsApi(deptId?: string): Promise<Result<SelectOptionItem[]>> {
  return request('/sys/post/options', {
    method: 'GET',
    params: deptId ? { deptId } : {},
  })
}
