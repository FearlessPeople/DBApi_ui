import { useRouter } from 'vue-router' // 从 vue-router 导入 useRouter，用于操作路由
import { Message } from '@arco-design/web-vue' // 从 arco-design 库中导入 Message 用于显示提示信息

import { useUserStore } from '@/store' // 导入项目中的用户状态管理 store

// 自定义钩子函数，用于处理用户相关的逻辑
export default function useUser() {
    const router = useRouter() // 获取路由实例
    const userStore = useUserStore() // 获取用户状态管理 store

    // 用户登出函数
    const logout = async (logoutTo?: string) => {
        await userStore.logout() // 调用 store 中的登出方法
        const currentRoute = router.currentRoute.value // 获取当前路由信息
        Message.success('登出成功') // 显示登出成功的提示信息

        // 跳转到指定的路由或登录页，并携带当前路由信息作为重定向参数
        router.push({
            name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'login', // 跳转到指定路由或默认为 'login'
            query: {
                ...router.currentRoute.value.query, // 保留当前路由的查询参数
                redirect: currentRoute.name as string // 将当前路由名称作为重定向参数
            }
        })
    }

    // 返回登出函数
    return {
        logout
    }
}
