import request from '@/utils/request'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function insertCode(data: any) {
  return request({
    url: '/tool/auto-code',
    method: 'post',
    data,
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function insertCodeWeb(data: any) {
  return request({
    url: '/tool/auto-code/web',
    method: 'post',
    data,
  })
}
