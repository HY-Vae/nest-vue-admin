import type { ListResult, Result, SelectOptionItem } from '@/types/global.ts'
import request from '@/utils/request.ts'
import type {
  CreateUserType,
  QueryUserType,
  UpdateUserType,
  UserDetailType,
  UserListType,
} from '@/views/sys/user/user.type'
import type { OrgQueryUserType, OrgUserListType } from './orgUser.type'

export function getUserApi(params: QueryUserType): Promise<ListResult<UserListType>> {
  return request('/sys/user', {
    method: 'GET',
    params,
  })
}

export function getUserOneApi(id: string): Promise<Result<UserDetailType>> {
  return request(`/sys/user/${id}`, {
    method: 'GET',
  })
}

export function addUserApi(data: CreateUserType): Promise<Result> {
  return request('/sys/user', {
    method: 'POST',
    data,
  })
}

export function updateUserApi(data: UpdateUserType): Promise<Result> {
  return request(`/sys/user/${data.id}`, {
    method: 'PATCH',
    data,
  })
}

export function deleteUserApi(id: string): Promise<Result> {
  return request(`/sys/user/${id}`, {
    method: 'DELETE',
  })
}

// 获取用户选项列表（用于下拉选择）
export function getUserOptionsApi(): Promise<Result<SelectOptionItem[]>> {
  return request('/sys/user/options', {
    method: 'GET',
  })
}
