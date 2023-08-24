import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import("../views/HomeView.vue")
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/back',
      name: 'back',
      component: () => import("../views/Backview.vue")
    },
    {
      path: '/content/:newsId', // 使用動態路由參數 :newsId
      name: 'content',
      component: () => import("../views/NewsContentView.vue"),
      props: true // 啟用 props 接收路由參數
    },
    {
      path: '/add',
      name: 'add',
      component: () => import("../views/AddView.vue")
    },
    {
      path: '/NewsContentAdmin/:newsId', // 使用動態路由參數 :newsId
      name: 'NewsContentAdmin',
      component: () => import("../views/NewsContentAdminView.vue"),
      props: true // 啟用 props 接收路由參數
    },
    {
      path: '/editNews',
      name: 'EditNews',
      component: () => import("../views/EditNews.vue"),
      // props: true
    },
  ]
})

export default router
