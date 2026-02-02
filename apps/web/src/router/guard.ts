import router from '@/router/index.ts'
import { useUserStore } from '@/stores/modules/user'
import { getToken } from '@/utils/auth.ts'

const noTokenPath = ['/auth/login']

router.beforeEach(async (to, from, next) => {
  const token = getToken()
  if (!token) {
    // 没有token
    if (noTokenPath.includes(to.path)) {
      next()
      return
    }
    next(`/auth/login?redirect=${to.fullPath}`)
    return
  }
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
  if (to.path === '/auth/login') {
    next('/')
    return
  }
  const userStore = useUserStore()
  if (!userStore.currentUser) {
    await userStore.getCurrentUser()
    await userStore.renderRoutes()
    next({ ...to, replace: true })
  }
  next()
  return
})
