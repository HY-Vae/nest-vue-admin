import type { AxiosResponse } from 'axios'
import { BASE_API } from '@/constants/constant.ts'
import { clearTokens, getRefreshToken, getToken, setToken } from '@/utils/auth.ts'
import router from '@/router'
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
      if (code === 401) {
        return handleTokenExpired(res, message)
      }
      if (code !== 200) {
        ElMessage.error(message)
        return Promise.reject(res.data)
      }
    }
    return res.data
  },
  (error) => {
    console.log('res', error)
    if (error.response?.status === 429) {
      ElMessage.error('请求过于频繁，请稍后再试')
      return Promise.reject(error)
    }
    const { message } = error.response.data
    let errMsg = message || error.message
    if (Array.isArray(message)) {
      errMsg = message.join('\n')
    }
    ElMessage.error(errMsg)
    return Promise.reject(error)
  },
)

/** 处理 401：用 refreshToken 静默刷新，队列重试 */
function handleTokenExpired(res: AxiosResponse, message: string) {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    clearTokensAndRedirect(message)
    return Promise.reject(res.data)
  }

  if (isRefreshing) {
    return new Promise((resolve) => {
      pendingRequests.push((newToken: string) => {
        res.config.headers.Authorization = `Bearer ${newToken}`
        resolve(request(res.config))
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
      res.config.headers.Authorization = `Bearer ${newToken}`
      return request(res.config)
    })
    .catch(() => {
      pendingRequests = []
      clearTokensAndRedirect('登录状态已过期')
      return Promise.reject(res.data)
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
