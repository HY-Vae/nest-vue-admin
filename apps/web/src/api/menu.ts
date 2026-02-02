import request from '@/utils/request.ts'
import type { ListResult, Result } from '@/types/global.ts'
import type {
  CreateMenuType,
  QueryMenuType,
  MenuListType,
  UpdateMenuType,
} from '@/views/system/menu/menu.type'

export function getMenuApi(params: QueryMenuType): Promise<ListResult<MenuListType>> {
  return request('/sys/menu', {
    method: 'GET',
    params,
  })
}

export function getMenuOneApi(id: string): Promise<Result<MenuListType>> {
  return request(`/sys/menu/${id}`, {
    method: 'GET',
  })
}

export function addMenuApi(data: CreateMenuType): Promise<Result> {
  return request('/sys/menu', {
    method: 'POST',
    data,
  })
}

export function updateMenuApi(data: UpdateMenuType): Promise<Result> {
  return request(`/sys/menu/${data.id}`, {
    method: 'PATCH',
    data,
  })
}

export function deleteMenuApi(id: string): Promise<Result> {
  return request(`/sys/menu/${id}`, {
    method: 'DELETE',
  })
}
