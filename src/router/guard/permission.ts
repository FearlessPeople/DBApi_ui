import type { Router, RouteRecordNormalized } from 'vue-router'
import NProgress from 'nprogress' // 导入进度条库，用于显示页面加载进度

import usePermission from '@/hooks/permission' // 导入自定义权限钩子，用于权限判断
import { useUserStore, useAppStore } from '@/store' // 导入用户状态和应用状态管理的 store
import { appRoutes } from '../routes' // 导入应用的路由配置
import { WHITE_LIST, NOT_FOUND } from '../constants' // 导入白名单和未找到页面的常量

// 设置权限守卫，拦截路由访问前进行权限判断
export default function setupPermissionGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        const appStore = useAppStore() // 获取应用状态
        const userStore = useUserStore() // 获取用户状态
        const Permission = usePermission() // 获取权限判断逻辑
        const permissionsAllow = Permission.accessRouter(to) // 判断当前路由是否允许访问

        if (appStore.menuFromServer) {
            // 针对来自服务端的菜单配置进行处理
            // Handle routing configuration from the server

            // 如果服务端菜单尚未加载完且当前路由不在白名单中，则加载服务端菜单配置
            // Refine the permission logic from the server's menu configuration as needed
            if (!appStore.appAsyncMenus.length && !WHITE_LIST.find(el => el.name === to.name)) {
                await appStore.fetchServerMenuConfig() // 加载服务端的菜单配置
            }

            // 合并服务端菜单配置和白名单
            const serverMenuConfig = [...appStore.appAsyncMenus, ...WHITE_LIST]

            let exist = false // 标记菜单是否存在
            while (serverMenuConfig.length && !exist) {
                const element = serverMenuConfig.shift() // 逐个检查菜单配置项
                if (element?.name === to.name) exist = true // 如果找到与当前路由匹配的菜单项，标记为 exist

                if (element?.children) {
                    serverMenuConfig.push(
                        ...(element.children as unknown as RouteRecordNormalized[]) // 如果有子菜单，加入检查队列
                    )
                }
            }

            // 如果菜单存在并且有权限，继续访问
            if (exist && permissionsAllow) {
                next()
            } else {
                // 否则跳转到未找到页面
                next(NOT_FOUND)
            }
        } else {
            // 如果菜单配置不来自服务端
            // eslint-disable-next-line no-lonely-if
            if (permissionsAllow) {
                next() // 如果有权限，继续访问
            } else {
                // 找到用户第一个有权限访问的路由，如果没有，跳转到未找到页面
                const destination = Permission.findFirstPermissionRoute(appRoutes, userStore.role) || NOT_FOUND
                next(destination) // 跳转到目标路由
            }
        }

        NProgress.done() // 结束进度条
    })
}
