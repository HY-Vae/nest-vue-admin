import type { MenuListType } from '@/views/system/menu/menu.type'
const modules = import.meta.glob('../views/**/*.vue')

export const transMenuRouter = (menus: MenuListType[]) => {
  const routes = []
  menus.forEach((item) => {
    const component = modules[`../${item.component}`]
    if (item.meta.defaultMenu) {
      routes.push({
        path: '/',
        name: 'home',
        component: () => import('../views/layout/basic.vue'),
        children: [
          {
            path: item.path,
            name: item.name,
            component,
            meta: item.meta,
            children: item.children ? transMenuRouter(item.children) : [],
          },
        ],
      })
    } else {
      routes.push({
        path: item.path,
        name: item.name,
        component,
        meta: item.meta,
        children: item.children ? transMenuRouter(item.children) : [],
      })
    }
  })
  return routes
}
