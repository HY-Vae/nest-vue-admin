import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/layout/auth.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/auth/login/index.vue'),
        },
      ],
    },
    {
      path: '/no-permission',
      name: 'NoPermission',
      component: () => import('../views/error/NoPermission.vue'),
      meta: {
        title: '无权限',
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/layout/basic.vue'),
      children: [
        {
          path: '',
          name: 'profile-index',
          component: () => import('../views/profile/index.vue'),
          meta: {
            title: '个人中心',
            closeTab: true,
          },
        },
      ],
    },
  ],
})

export default router
