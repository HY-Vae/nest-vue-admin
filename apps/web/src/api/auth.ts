import request from '@/utils/request.ts'
import type { CurrentUserType } from '@/types/user.ts'
import type { Result } from '@/types/global.ts'
import type { MenuListType } from '@/views/system/menu/menu.type'
import type { PermissionType } from '@/views/system/role/role.type'

export function loginApi(data) {
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
