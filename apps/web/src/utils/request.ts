import { BASE_API } from '@/constants/constant.ts'
import { clearTokens, getRefreshToken, getToken, setToken } from '@/utils/auth.ts'
import router from '@/router'
import { useLockStore } from '@/stores/modules/lock'
import axios from 'axios'

// --- 401 刷新队列 ---
let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

const request = axios.create({
  baseURL: BASE_API,
  timeout: 30000,
})

request.interceptors.request.use(
  (config) => {
    // 锁屏状态下不发送业务请求（auth 接口放行）
    const lockStore = useLockStore()
    if (lockStore.isLocked && !config.url?.includes('/auth/')) {
      return Promise.reject(new Error('屏幕已锁定'))
    }
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    ElMessage.error(error.message)
    return error
  },
)

request.interceptors.response.use(
  (res) => {
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }
    if (res && res.data) {
      const { code, message } = res.data
      if (code !== 200) {
        ElMessage.error(message)
        return Promise.reject(res.data)
      }
    }
    return res.data
  },
  (error) => {
    if (!error.response) {
      ElMessage.error('网络连接异常，请检查网络')
      return Promise.reject(error)
    }
    const status = error.response.status
    if (status === 401) {
      return handleTokenExpired(error)
    }
    if (status === 429) {
      ElMessage.error('请求过于频繁，请稍后再试')
      return Promise.reject(error)
    }
    const { message } = error.response.data || {}
    let errMsg = message || error.message
    if (Array.isArray(message)) {
      errMsg = message.join('\n')
    }
    ElMessage.error(errMsg)
    return Promise.reject(error)
  },
)

/** 处理 401：用 refreshToken 静默刷新，队列重试 */
function handleTokenExpired(error: any) {
  const config = error.config
  const message = error.response?.data?.message || '登录状态已过期'
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    clearTokensAndRedirect(message)
    return Promise.reject(error)
  }

  if (isRefreshing) {
    return new Promise((resolve) => {
      pendingRequests.push((newToken: string) => {
        config.headers.Authorization = `Bearer ${newToken}`
        resolve(request(config))
      })
    })
  }

  isRefreshing = true
  return axios
    .post(`${BASE_API}/auth/refresh`, { refreshToken })
    .then((refreshRes) => {
      const newToken = refreshRes.data.data.accessToken
      setToken(newToken)
      pendingRequests.forEach((cb) => cb(newToken))
      pendingRequests = []
      config.headers.Authorization = `Bearer ${newToken}`
      return request(config)
    })
    .catch(() => {
      pendingRequests = []
      clearTokensAndRedirect('登录状态已过期')
      return Promise.reject(error)
    })
    .finally(() => {
      isRefreshing = false
    })
}

function clearTokensAndRedirect(message?: string) {
  clearTokens()
  ElMessage.error(message || '登录状态已过期')
  const currentPath = encodeURIComponent(router.currentRoute.value.fullPath)
  router.push(`/auth/login?redirect=${currentPath}`)
}

export default request
