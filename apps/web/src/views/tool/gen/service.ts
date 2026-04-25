import request from '@/utils/request'

export function insertCode(data: Record<string, unknown>) {
  return request('/tool/auto-code', { method: 'POST', data })
}

export function insertCodeWeb(data: Record<string, unknown>) {
  return request('/tool/auto-code/web', { method: 'POST', data })
}
