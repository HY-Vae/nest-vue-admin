import type { Result } from '@/types/global.ts'
import type { CurrentUserType } from '@/types/user.ts'
import request from '@/utils/request.ts'
import type { MenuListType } from '@/views/sys/menu/menu.type'
import type { PermissionType } from '@/views/sys/role/role.type'

export interface LoginReqType {
  userName: string
  password: string
  captcha: string
  captchaId: string
}

export function loginApi(data: LoginReqType) {
  return request('/auth/login', {
    method: 'POST',
    data,
  })
}

export function getCaptchaApi(id?: string) {
  return request('/auth/captcha', {
    method: 'GET',
    params: {
      id,
    },
  })
}

export function getUserInfoApi(): Promise<Result<CurrentUserType>> {
  return request('/auth/userInfo', {
    method: 'GET',
  })
}

export function getRoutesApi(): Promise<Result<MenuListType[]>> {
  return request('/auth/routes', {
    method: 'GET',
  })
}

export function getAllPermissionsApi(): Promise<Result<PermissionType>> {
  return request('/auth/allPermissions', {
    method: 'GET',
  })
}

export function logoutApi(): Promise<Result<null>> {
  return request('/auth/logout', {
    method: 'POST',
  })
}
