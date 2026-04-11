import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from '@/utils/request.ts'
import {
  getUserNoticesApi,
  markNoticeReadApi,
  getUserTodosApi,
  completeTodoApi,
  cancelTodoApi,
  getMessageSummaryApi,
  type NoticeListType,
  type TodoListType,
  type QueryNoticeType,
  type QueryTodoType,
  type MessageSummary,
} from './service'

import type { ListResult, Result } from '@/types/global.ts'

// Mock request 函数
const mockRequest = vi.fn<[string, any], Promise<any>>()
vi.mock('@/utils/request.ts', () => ({
  default: (...args: [string, any]) => mockRequest(...args),
}))

describe('message-center service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUserNoticesApi', () => {
    it('应该调用正确的接口地址', async () => {
      mockRequest.mockResolvedValueOnce({
        code: 200,
        data: {
          list: [
            { id: 'notice-1', title: '通知1', content: '内容1', isRead: false },
            { id: 'notice-2', title: '通知2', content: '内容2', isRead: true },
          ],
          total: 2,
        },
        message: 'success',
      })

      const result = await getUserNoticesApi()

      expect(mockRequest).toHaveBeenCalledWith('/sys/notice/user/list', {
        method: 'GET',
        params: undefined,
      })
      expect(result.data.list).toHaveLength(2)
      expect(result.data.total).toBe(2)
    })

    it('应该支持传递查询参数', async () => {
      const params: QueryNoticeType = {
        title: '测试',
        type: 'notice',
        status: '0',
        isRead: false,
        current: 1,
        pageSize: 10,
      }

      mockRequest.mockResolvedValueOnce({
        code: 200,
        data: { list: [], total: 0 },
        message: 'success',
      })
      const result = await getUserNoticesApi(params)
      expect(mockRequest).toHaveBeenCalledWith('/sys/notice/user/list', {
        method: 'GET',
        params,
      })
      expect(result).toBeDefined()
    })
  })

  describe('markNoticeReadApi', () => {
    it('应该调用正确的标记已读接口', async () => {
      mockRequest.mockResolvedValueOnce({
        code: 200,
        data: null,
        message: 'success',
      })
      const result = await markNoticeReadApi('notice-1')
      expect(mockRequest).toHaveBeenCalledWith('/sys/notice/notice-1/read', {
        method: 'POST',
      })
      expect(result).toBeDefined()
    })
  })

  describe('getUserTodosApi', () => {
    it('应该调用正确的待办列表接口', async () => {
      mockRequest.mockResolvedValueOnce({
        code: 200,
        data: {
          list: [
            { id: 'todo-1', title: '待办1', status: 'pending' },
            { id: 'todo-2', title: '待办2', status: 'completed' },
          ],
          total: 2,
        },
        message: 'success',
      })
      const result = await getUserTodosApi()
      expect(mockRequest).toHaveBeenCalledWith('/sys/todo', {
        method: 'GET',
        params: undefined,
      })
      expect(result.data.list).toHaveLength(2)
      expect(result.data.total).toBe(2)
    })

    it('应该支持传递查询参数', async () => {
      const params: QueryTodoType = {
        title: '审批',
        bizType: 'approval',
        status: 'pending',
        current: 1,
        pageSize: 10,
      }
      mockRequest.mockResolvedValueOnce({
        code: 200,
        data: { list: [], total: 0 },
        message: 'success',
      })
      const result = await getUserTodosApi(params)
      expect(mockRequest).toHaveBeenCalledWith('/sys/todo', {
        method: 'GET',
        params,
      })
      expect(result).toBeDefined()
    })
  })

  describe('completeTodoApi', () => {
    it('应该调用正确的完成待办接口', async () => {
      mockRequest.mockResolvedValueOnce({
        code: 200,
        data: null,
        message: 'success',
      })
      const result = await completeTodoApi('todo-1')
      expect(mockRequest).toHaveBeenCalledWith('/sys/todo/todo-1/complete', {
        method: 'POST',
      })
      expect(result).toBeDefined()
    })
  })

  describe('cancelTodoApi', () => {
    it('应该调用正确的取消待办接口', async () => {
      mockRequest.mockResolvedValueOnce({
        code: 200,
        data: null,
        message: 'success',
      })
      const result = await cancelTodoApi('todo-1')
      expect(mockRequest).toHaveBeenCalledWith('/sys/todo/todo-1/cancel', {
        method: 'POST',
      })
      expect(result).toBeDefined()
    })
  })

  describe('getMessageSummaryApi', () => {
    it('应该调用正确的消息汇总接口', async () => {
      mockRequest.mockResolvedValueOnce({
        code: 200,
        data: {
          noticeUnread: 5,
          todoPending: 3,
        },
        message: 'success',
      })
      const result = await getMessageSummaryApi()
      expect(mockRequest).toHaveBeenCalledWith('/sys/message/summary', {
        method: 'GET',
      })
      expect(result.data).toEqual({
        noticeUnread: 5,
        todoPending: 3,
      })
    })
  })

  describe('类型定义', () => {
    it('NoticeListType 应该包含正确的字段', () => {
      const notice: NoticeListType = {
        id: '1',
        title: '测试通知',
        content: '测试内容',
        type: 'notice',
        status: '0',
        createBy: 'admin',
        createdAt: new Date(),
        isRead: false,
        readAt: null,
      }
      expect(notice.id).toBe('1')
      expect(notice.title).toBe('测试通知')
      expect(notice.isRead).toBe(false)
    })
    it('TodoListType 应该包含正确的字段', () => {
      const todo: TodoListType = {
        id: '1',
        title: '测试待办',
        content: '测试内容',
        bizType: 'approval',
        priority: 'high',
        status: 'pending',
        link: '/test',
        bizId: 'biz-1',
        userId: 'user-1',
        createBy: 'admin',
        createdAt: new Date(),
        completeBy: null,
        completedAt: null,
      }
      expect(todo.id).toBe('1')
      expect(todo.status).toBe('pending')
      expect(todo.bizType).toBe('approval')
    })
    it('MessageSummary 应该包含正确的字段', () => {
      const summary: MessageSummary = {
        noticeUnread: 5,
        todoPending: 3,
      }
      expect(summary.noticeUnread).toBe(5)
      expect(summary.todoPending).toBe(3)
    })
  })
})
