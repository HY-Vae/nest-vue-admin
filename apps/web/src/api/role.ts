import type { ListResult, Result, SelectOptionItem } from '@/types/global.ts'
import request from '@/utils/request.ts'
import type {
  CreateRoleType,
  QueryRoleType,
  RoleListType,
  UpdateRoleType,
} from '@/views/sys/role/role.type'

export function getRoleApi(params: QueryRoleType): Promise<ListResult<RoleListType>> {
  return request('/sys/role', {
    method: 'GET',
    params,
  })
}

export function getRoleOptionsApi(): Promise<Result<SelectOptionItem[]>> {
  return request('/sys/role/options', {
    method: 'GET',
  })
}

export function getRoleOneApi(id: string): Promise<Result<RoleListType>> {
  return request(`/sys/role/${id}`, {
    method: 'GET',
  })
}

export function addRoleApi(data: CreateRoleType): Promise<Result> {
  return request('/sys/role', {
    method: 'POST',
    data,
  })
}

export function updateRoleApi(data: UpdateRoleType): Promise<Result> {
  return request(`/sys/role/${data.id}`, {
    method: 'PATCH',
    data,
  })
}

export function deleteRoleApi(ids: string[]): Promise<Result> {
  return request(`/sys/role`, {
    method: 'DELETE',
    data: {
      ids,
    },
  })
}
