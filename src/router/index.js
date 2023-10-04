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
      path: '/ParentCategoryContent/:newsId', // 使用動態路由參數 :newsId
      name: 'ParentCategoryContent',
      component: () => import("../views/ParentCategoryContentView.vue"),
      props: true // 啟用 props 接收路由參數
    },
    // {
    //   path: '/NewsContent/:newsId', // 使用動態路由參數 :newsId
    //   name: 'NewsContent',
    //   component: () => import("../views/NewsContentView.vue"),
    //   props: true // 啟用 props 接收路由參數
    // },
    {
      path: '/editNews',
      name: 'EditNews',
      component: () => import("../views/EditNews.vue"),
      // props: true
    },
    {
      path: '/parentCategory',
      name: 'parentCategory',
      component: () => import("../views/ParentCategoryView.vue")
    },
    {
      path: '/category',
      name: 'category',
      component: () => import("../views/CategoryView.vue")
    },
    
    {
      path: '/findNewsByParentCategory/:parentCategoryName',
      name: 'findNewsByParentCategory',
      component: () => import("../views/FindNewsByParentCategoryView.vue")
    },
    {
      path: '/findNewsByCategory/:categoryName',
      name: 'findNewsByCategory',
      component: () => import("../views/FindNewsByCategoryView.vue")
    },
    {
      path: '/addParentcategory',
      name: 'addParentcategory',
      component: () => import("../views/AddParentCategoryView.vue")
    },
    {
      path: '/alertParentcategory',
      name: 'alertParentcategory',
      component: () => import("../views/AlertParentCategoryView.vue")
    },
  ]
})

export default router
