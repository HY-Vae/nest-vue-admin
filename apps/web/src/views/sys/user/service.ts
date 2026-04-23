import type { ListResult, Result, SelectOptionItem } from '@/types/global.ts'
import request from '@/utils/request.ts'
import type {
  CreateUserType,
  QueryUserType,
  UpdateUserType,
  UserDetailType,
  UserListType,
} from '@/views/sys/user/user.type'

export interface UpdateProfileType {
  avatar?: string
  nickName?: string
  email?: string
  phone?: string
  sex?: string
}

export interface UpdatePasswordType {
  oldPassword: string
  newPassword: string
}

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

// 获取全量用户列表（含部门信息，用于角色分配等场景）
export function getUserAllWithDeptApi(): Promise<
  Result<
    {
      id: string
      nickName: string
      userName: string
      deptId: string | null
      dept: { id: string; deptName: string } | null
    }[]
  >
> {
  return request('/sys/user/all-with-dept', {
    method: 'GET',
  })
}

// 获取当前用户个人信息
export function getProfileApi(): Promise<Result<UserDetailType>> {
  return request('/sys/user/profile', {
    method: 'GET',
  })
}

// 更新个人信息
export function updateProfileApi(data: UpdateProfileType): Promise<Result> {
  return request('/sys/user/profile', {
    method: 'PATCH',
    data,
  })
}

// 修改密码
export function updatePasswordApi(data: UpdatePasswordType): Promise<Result> {
  return request('/sys/user/password', {
    method: 'PATCH',
    data,
  })
}
