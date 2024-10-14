import type { Router } from 'vue-router'
import { setRouteEmitter } from '@/utils/route-listener' // 导入设置路由变化事件的工具函数
import setupUserLoginInfoGuard from './userLoginInfo' // 导入用户登录信息守卫
import setupPermissionGuard from './permission' // 导入权限守卫

// 设置页面守卫，用于路由变化时执行一些逻辑
function setupPageGuard(router: Router) {
    router.beforeEach(async to => {
        // 发射路由变化事件
        setRouteEmitter(to)
    })
}

// 创建路由守卫，包括页面守卫、用户登录信息守卫和权限守卫
export default function createRouteGuard(router: Router) {
    setupPageGuard(router) // 设置页面守卫
    setupUserLoginInfoGuard(router) // 设置用户登录信息守卫
    setupPermissionGuard(router) // 设置权限守卫
}
