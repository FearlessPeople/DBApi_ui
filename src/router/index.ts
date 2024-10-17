import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router' // 导入 Vue Router 创建函数
import NProgress from 'nprogress' // 导入页面加载进度条
import 'nprogress/nprogress.css' // 导入进度条样式

import { appRoutes } from './routes' // 导入应用路由配置
import { REDIRECT_MAIN, NOT_FOUND_ROUTE } from './routes/base' // 导入重定向路由和未找到路由
import createRouteGuard from './guard' // 导入路由守卫配置

NProgress.configure({ showSpinner: false }) // 配置 NProgress，禁用进度条的旋转图标

const router = createRouter({
    history: createWebHashHistory(), // 使用 HTML5 History 模式
    routes: [
        {
            path: '/', // 根路径
            redirect: 'login' // 重定向到登录页面
        },
        {
            path: '/login', // 登录页面路径
            name: 'login', // 登录页面名称
            component: () => import('@/views/login/index.vue'), // 登录页面组件，使用动态导入
            meta: {
                requiresAuth: false // 登录页面不需要权限
            }
        },
        ...appRoutes, // 应用的其他路由配置
        REDIRECT_MAIN, // 重定向路由
        NOT_FOUND_ROUTE // 404 未找到路由
    ],
    scrollBehavior() {
        return { top: 0 } // 页面滚动行为，始终滚动到页面顶部
    }
})

createRouteGuard(router) // 设置路由守卫

export default router // 导出路由实例
