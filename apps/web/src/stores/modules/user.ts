import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getRoutesApi, getUserInfoApi } from '@/api/auth.ts'
import type { CurrentUserType } from '@/types/user.ts'
import type { MenuListType } from '@/views/system/menu/menu.type'
import router from '@/router'
import { transMenuRouter } from '@/utils/route.ts'

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

    addRouter()
  }
  const addRouter = () => {
    // 我需要递归去处理菜单信息
    const routes = transMenuRouter(menus.value)
    console.log(routes)
    routes.forEach((item) => {
      console.log('item', item)
      if (!item.path.startsWith('http')) {
        router.addRoute(item)
      }
    })
    return true
  }

  return { currentUser, getCurrentUser, menus, renderRoutes }
})
