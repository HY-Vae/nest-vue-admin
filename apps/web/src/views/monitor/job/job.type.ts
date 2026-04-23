/* 任务列表项 */
export interface JobListType {
  id: string
  jobName: string
  jobGroup: string
  invokeTarget: string
  cronExpression: string
  misfirePolicy: string
  concurrent: string
  status: string
  remark: string | null
  createBy: string | null
  createdAt: string
  updateBy: string | null
  updatedAt: string
}

/* 创建任务参数 */
export interface CreateJobType {
  jobName: string
  jobGroup: string
  invokeTarget: string
  cronExpression: string
  misfirePolicy?: string
  concurrent?: string
  status?: string
  remark?: string
}

/* 更新任务参数 */
export interface UpdateJobType {
  jobName: string
  jobGroup: string
  invokeTarget: string
  cronExpression: string
  misfirePolicy?: string
  concurrent?: string
  remark?: string
}

/* 查询任务参数 */
export interface QueryJobType {
  current: number
  pageSize: number
  jobName?: string
  jobGroup?: string
  status?: string
}

/* 任务日志列表项 */
export interface JobLogListType {
  id: number
  jobName: string
  jobGroup: string
  invokeTarget: string
  status: string
  jobMessage: string | null
  exceptionInfo: string | null
  startTime: string | null
  endTime: string | null
  createdAt: string
}

/* 查询任务日志参数 */
export interface QueryJobLogType {
  current: number
  pageSize: number
  jobName?: string
  jobGroup?: string
  status?: string
  startTime?: string
  endTime?: string
}
