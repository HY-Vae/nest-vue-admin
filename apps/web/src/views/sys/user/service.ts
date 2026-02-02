import request from '@/utils/request.ts'
import type { ListResult, Result } from '@/types/global.ts'
import type {
  CreateUserType,
  QueryUserType,
  UserListType,
  UpdateUserType,
} from '@/views/sys/user/user.type'

export function getUserApi(params: QueryUserType): Promise<ListResult<UserListType>> {
  return request('/sys/user', {
    method: 'GET',
    params,
  })
}

export function getUserOneApi(id: string): Promise<Result<UserListType>> {
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

export function deleteUserApi(ids: string[]): Promise<Result> {
  return request(`/sys/user`, {
    method: 'DELETE',
    data: {
      ids,
    },
  })
}
