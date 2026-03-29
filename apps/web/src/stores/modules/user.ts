import { getRoutesApi, getUserInfoApi } from '@/api/auth.ts'
import router from '@/router'
import type { CurrentUserType } from '@/types/user.ts'
import { transMenuRouter } from '@/utils/route.ts'
import type { MenuListType } from '@/views/sys/menu/menu.type'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<CurrentUserType | undefined>(undefined)

  const getCurrentUser = async () => {
    const res = await getUserInfoApi()
    currentUser.value = res.data
  }
  const menus = ref<MenuListType[]>([])

  const renderRoutes = async () => {
    const res = await getRoutesApi()
    menus.value = res.data

    // 没有菜单权限返回 false
    if (!menus.value || menus.value.length === 0) {
      return false
    }

    addRouter()
    return true
  }

  // 保存动态添加的路由名称，用于退出时删除
  const addedRouteNames = ref<string[]>([])

  const addRouter = () => {
    // 我需要递归去处理菜单信息
    const routes = transMenuRouter(menus.value)
    console.log(routes)
    routes.forEach((item) => {
      console.log('item', item)
      if (!item.path.startsWith('http')) {
        router.addRoute(item)
        if (item.name) {
          addedRouteNames.value.push(item.name as string)
        }
      }
    })
    return true
  }

  // 退出登录时清除状态
  const logout = () => {
    // 清除动态添加的路由
    addedRouteNames.value.forEach((name) => {
      router.removeRoute(name)
    })
    addedRouteNames.value = []
    // 清除状态
    currentUser.value = undefined
    menus.value = []
    // 清除 token
    localStorage.removeItem('token')
  }

  return { currentUser, getCurrentUser, menus, renderRoutes, logout }
})
