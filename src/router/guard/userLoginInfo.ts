import type { Router, LocationQueryRaw } from 'vue-router'
import NProgress from 'nprogress' // 导入进度条库，用于显示页面加载进度

import { useUserStore } from '@/store' // 导入用户状态管理的 store
import { isLogin } from '@/utils/auth' // 导入登录状态检查工具函数

// 设置用户登录信息守卫，拦截路由访问前进行登录状态和用户信息的检查
export default function setupUserLoginInfoGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        NProgress.start() // 开始显示进度条
        const userStore = useUserStore() // 获取用户状态

        if (isLogin()) {
            // 如果用户已登录
            if (userStore.role) {
                // 如果用户角色已加载，继续访问
                next()
            } else {
                // 如果用户角色尚未加载
                try {
                    await userStore.info() // 尝试加载用户信息
                    next() // 加载成功，继续访问
                } catch (error) {
                    // 如果加载用户信息失败
                    await userStore.logout() // 登出用户
                    next({
                        name: 'login', // 跳转到登录页面
                        query: {
                            redirect: to.name, // 重定向到当前访问的路由
                            ...to.query // 保留原有查询参数
                        } as LocationQueryRaw
                    })
                }
            }
        } else {
            // 如果用户未登录
            if (to.name === 'login') {
                // 如果目标路由是登录页面，继续访问
                next()
                return
            }
            // 否则跳转到登录页面
            next({
                name: 'login',
                query: {
                    redirect: to.name, // 重定向到当前访问的路由
                    ...to.query // 保留原有查询参数
                } as LocationQueryRaw
            })
        }
    })
}
