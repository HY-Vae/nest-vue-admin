import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    // {
    //   path: '/',
    //   redirect: '/about',
    //   name: 'home',
    // },
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
    // {
    //   path: '/welcome',
    //   name: 'welcome',
    //   component: import('../views/layout/basic.vue'),
    //   children: [
    //     {
    //       path: 'index',
    //       name: 'index',
    //       component: import('../views/welcome/welcome.vue'),
    //     },
    //   ],
    // },
    // {
    //   path: '/system',
    //   name: 'system',
    //   component: import('../views/layout/basic.vue'),
    //   children: [
    //     {
    //       path: '/system/menu',
    //       name: 'menu',
    //       component: import('../views/system/menu/menu.vue'),
    //     },
    //     {
    //       path: 'role',
    //       name: 'role',
    //       component: import('../views/system/role/user.vue'),
    //     },
    //     {
    //       path: 'dict',
    //       name: 'dict',
    //       component: import('../views/system/dict/dict.vue'),
    //     },
    //     {
    //       path: 'dict-detail/:code',
    //       name: 'dict-detail',
    //       component: import('../views/system/dictDetail/dictDetail.vue'),
    //     },
    //   ],
    // },
    // {
    //   path: '/tool/gen',
    //   name: 'gen',
    //   component: () => import('../views/tool/gen/gen.vue'),
    // },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
