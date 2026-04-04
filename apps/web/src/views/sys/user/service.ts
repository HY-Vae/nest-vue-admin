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

// ========== 组织架构页面专用接口 ==========

// 获取组织架构部门树（带用户数量）
export function getOrgDeptTreeApi(): Promise<Result<any[]>> {
  return request('/sys/dept', {
    method: 'GET',
  })
}

// 获取组织架构岗位列表（带用户数量）
export function getOrgPostListApi(deptId?: string): Promise<Result<any[]>> {
  return request('/sys/post', {
    method: 'GET',
    params: { deptId, pageSize: 1000 },
  })
}
