import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/redirect/:path(.*)',
      name: 'Redirect',
      component: {
        beforeRouteEnter(to, from, next) {
          next((vm) => {
            vm.$router.replace('/' + to.params.path)
          })
        },
        render: () => null,
      },
      meta: {
        hidden: true,
      },
    },
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
