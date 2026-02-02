import request from '@/utils/request'

// 查询生成表数据
export function insertCode(data) {
  return request({
    url: '/tool/auto-code',
    method: 'post',
    data,
  })
}

export function insertCodeWeb(data) {
  return request({
    url: '/tool/auto-code/web',
    method: 'post',
    data,
  })
}
