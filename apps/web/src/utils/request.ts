import { BASE_API } from '@/constants/constant.ts'
import router from '@/router'
import axios from 'axios'

const request = axios.create({
  baseURL: BASE_API,
  timeout: 30000,
})

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
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
        localStorage.removeItem('token')
        ElMessage.error(message)
        const currentPath = encodeURIComponent(router.currentRoute.value.fullPath)
        router.push(`/auth/login?redirect=${currentPath}`)
        return Promise.reject(res.data)
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
    const { message } = error.response.data
    let errMsg = message || error.message
    if (Array.isArray(message)) {
      errMsg = message.join('\n')
    }
    ElMessage.error(errMsg)
    return Promise.reject(error)
  },
)

export default request
