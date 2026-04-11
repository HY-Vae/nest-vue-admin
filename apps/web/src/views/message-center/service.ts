import type { ListResult, Result } from '@/types/global.ts'
import request from '@/utils/request.ts'

// ========== 通知相关 ==========

export interface NoticeListType {
  id: string
  title: string
  content: string
  type: string
  status: string
  createBy: string | null
  createdAt: Date
  isRead?: boolean
  readAt?: Date | null
}

export interface QueryNoticeType {
  title?: string
  type?: string
  status?: string
  isRead?: boolean
  current?: number
  pageSize?: number
}

// 获取用户通知列表
export function getUserNoticesApi(params?: QueryNoticeType): Promise<ListResult<NoticeListType>> {
  return request('/sys/notice/user/list', {
    method: 'GET',
    params,
  })
}

// 标记通知为已读
export function markNoticeReadApi(id: string): Promise<Result> {
  return request(`/sys/notice/${id}/read`, {
    method: 'POST',
  })
}

// ========== 待办相关 ==========

export interface TodoListType {
  id: string
  title: string
  content: string
  bizType: string
  priority: string
  status: string
  link: string | null
  bizId: string | null
  userId: string
  createBy: string | null
  createdAt: Date
  completeBy: string | null
  completedAt: Date | null
}

export interface QueryTodoType {
  title?: string
  bizType?: string
  status?: string
  current?: number
  pageSize?: number
}

// 获取用户待办列表
export function getUserTodosApi(params?: QueryTodoType): Promise<ListResult<TodoListType>> {
  return request('/sys/todo', {
    method: 'GET',
    params,
  })
}

// 完成待办
export function completeTodoApi(id: string): Promise<Result> {
  return request(`/sys/todo/${id}/complete`, {
    method: 'POST',
  })
}

// 取消待办
export function cancelTodoApi(id: string): Promise<Result> {
  return request(`/sys/todo/${id}/cancel`, {
    method: 'POST',
  })
}

// ========== 消息中心聚合 ==========

export interface MessageSummary {
  noticeUnread: number
  todoPending: number
}

// 获取消息汇总
export function getMessageSummaryApi(): Promise<Result<MessageSummary>> {
  return request('/sys/message/summary', {
    method: 'GET',
  })
}
