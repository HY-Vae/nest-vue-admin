import type { ListResult, Result } from '@/types/global.ts'
import request from '@/utils/request.ts'
import type {
  QueryNoticeType,
  NoticeListType,
  CreateNoticeType,
  UpdateNoticeType,
} from './notice.type'

// 获取通知列表（管理员用）
export function getNoticeApi(params: QueryNoticeType): Promise<ListResult<NoticeListType>> {
  return request('/sys/notice', {
    method: 'GET',
    params,
  })
}

// 获取通知详情
export function getNoticeOneApi(id: string): Promise<Result<NoticeListType>> {
  return request(`/sys/notice/${id}`, {
    method: 'GET',
  })
}

// 新增通知
export function addNoticeApi(data: CreateNoticeType): Promise<Result> {
  return request('/sys/notice', {
    method: 'POST',
    data,
  })
}

// 更新通知
export function updateNoticeApi(data: UpdateNoticeType): Promise<Result> {
  const { id, ...other } = data
  return request(`/sys/notice/${id}`, {
    method: 'PATCH',
    data: other,
  })
}

// 删除通知
export function deleteNoticeApi(id: string): Promise<Result> {
  return request(`/sys/notice/${id}`, {
    method: 'DELETE',
  })
}

// ========== 用户端接口 ==========

// 获取未读通知数量
export function getUnreadCountApi(): Promise<Result<{ count: number }>> {
  return request('/sys/notice/unread/count', {
    method: 'GET',
  })
}

// 获取当前用户的通知列表
export function getUserNoticesApi(params?: { current?: number; pageSize?: number; isRead?: boolean }): Promise<ListResult<NoticeListType>> {
  return request('/sys/notice/user/list', {
    method: 'GET',
    params,
  })
}

// 标记通知为已读
export function markAsReadApi(id: string): Promise<Result> {
  return request(`/sys/notice/${id}/read`, {
    method: 'POST',
  })
}

// 标记所有通知为已读
export function markAllAsReadApi(): Promise<Result> {
  return request('/sys/notice/read/all', {
    method: 'POST',
  })
}
