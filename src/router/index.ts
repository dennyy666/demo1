import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      meta: { public: true },
      component: () => import('../login/Login.vue'),
    },  
    {
      path: '/layout',
      name: 'layout',
      component: () => import('../layout/MainLayout.vue'),
      children: [
        {
          path: 'homeConfiguration/heroManage',
          name: 'heroManage',
          component: () => import('../views/homeConfiguration/heroManage/HeroManageView.vue'),
        },
      ],         
    }     
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('auth_token')
  const isLoggedIn = Boolean(token)
  // 1. 公开页面：直接放行
  if (to.meta.public) {
    // 唯一的例外：已登录用户访问登录页 → 送回首页
    if (to.name === 'login' && isLoggedIn) {
      return { path: '/layout' }
    }
    return true
  }

  // 2. 其余全部需要鉴权
  if (!isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 3. 其他公开路由直接放行
  return true
})


export default router
