import type { ListResult, Result } from '@/types/global.ts'
import request from '@/utils/request.ts'
import type {
  CreateJobType,
  JobListType,
  JobLogListType,
  QueryJobLogType,
  QueryJobType,
  UpdateJobType,
} from './job.type'

/* 查询任务列表 */
export function getJobListApi(params: QueryJobType): Promise<ListResult<JobListType>> {
  return request('/monitor/job', { method: 'GET', params })
}

/* 查询任务详情 */
export function getJobOneApi(id: string): Promise<Result<JobListType>> {
  return request(`/monitor/job/${id}`, { method: 'GET' })
}

/* 新增任务 */
export function createJobApi(data: CreateJobType): Promise<Result<JobListType>> {
  return request('/monitor/job', { method: 'POST', data })
}

/* 编辑任务 */
export function updateJobApi(id: string, data: UpdateJobType): Promise<Result<JobListType>> {
  return request(`/monitor/job/${id}`, { method: 'PUT', data })
}

/* 修改任务状态 */
export function changeJobStatusApi(data: { id: string; status: string }): Promise<Result> {
  return request('/monitor/job/status', { method: 'PUT', data })
}

/* 执行一次任务 */
export function runJobOnceApi(id: string): Promise<Result> {
  return request(`/monitor/job/run/${id}`, { method: 'PUT' })
}

/* 批量删除任务 */
export function batchDeleteJobApi(ids: string[]): Promise<Result> {
  return request('/monitor/job', { method: 'DELETE', params: { ids } })
}

/* 查询任务日志列表 */
export function getJobLogListApi(params: QueryJobLogType): Promise<ListResult<JobLogListType>> {
  return request('/monitor/job/log/list', { method: 'GET', params })
}

/* 查询任务日志详情 */
export function getJobLogOneApi(id: number): Promise<Result<JobLogListType>> {
  return request(`/monitor/job/log/${id}`, { method: 'GET' })
}

/* 批量删除任务日志 */
export function batchDeleteJobLogApi(ids: number[]): Promise<Result> {
  return request('/monitor/job/log', { method: 'DELETE', params: { ids } })
}

/* 清空任务日志 */
export function cleanJobLogApi(): Promise<Result> {
  return request('/monitor/job/log/clean', { method: 'DELETE' })
}
