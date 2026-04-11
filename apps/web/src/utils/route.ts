import type { MenuListType } from '@/views/sys/menu/menu.type'
import type { RouteRecordRaw } from 'vue-router'

const modules = import.meta.glob('../views/**/*.vue')

export const transMenuRouter = (menus: MenuListType[]): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []
  menus.forEach((item) => {
    const component = modules[`../${item.component}`]
    if (item.meta.defaultMenu) {
      routes.push({
        path: '/',
        name: 'home',
        component: () => import('../views/layout/basic.vue'),
        meta: { hidden: true },
        children: [
          {
            path: item.path,
            name: item.name,
            component,
            meta: item.meta as unknown as Record<string, unknown>,
            children: item.children ? transMenuRouter(item.children) : [],
          },
        ],
      } as unknown as RouteRecordRaw)
    } else {
      routes.push({
        path: item.path,
        name: item.name,
        component,
        meta: item.meta as unknown as Record<string, unknown>,
        children: item.children ? transMenuRouter(item.children) : [],
      } as unknown as RouteRecordRaw)
    }
  })
  return routes
}
