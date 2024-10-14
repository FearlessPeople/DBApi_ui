import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store'

// 自定义权限相关的 hook 函数
export default function usePermission() {
    const userStore = useUserStore() // 获取用户状态

    return {
        // 根据角色判断当前用户是否有访问路由的权限
        // accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
        //     return (
        //         !route.meta?.requiresAuth || // 如果路由不需要权限认证，允许访问
        //         !route.meta?.roles || // 如果路由不指定角色，允许访问
        //         route.meta?.roles?.includes('*') || // 如果路由的角色包含 '*'，表示所有角色都可以访问
        //         route.meta?.roles?.includes(userStore.role) // 如果路由的角色列表中包含当前用户的角色，允许访问
        //     )
        // },

        // 根据权限点判断当前用户是否有访问路由的权限
        accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
            // 如果是登录页，直接放行
            if (route.path === '/login') {
                return true
            }

            // 如果路由配置不需要权限访问，则允许访问
            if (!route.meta?.requiresAuth) {
                return true
            }

            // 如果路由未配置权限点，则允许访问
            if (!route.meta?.permissions || route.meta?.permissions.length === 0) {
                return true
            }

            // 如果未获取到用户权限列表，则禁止访问
            if (!userStore.permissions || userStore.permissions.length === 0) {
                return false
            }

            // 检查权限点
            const checkStatus = route.meta?.permissions.every(permission => userStore.permissions.includes(permission)) // 确保权限点都在用户的权限列表中
            return checkStatus
        },
        // 查找第一个符合权限的路由
        findFirstPermissionRoute(_routers: any, role = 'admin') {
            const cloneRouters = [..._routers] // 克隆路由数组，避免直接修改原数组
            while (cloneRouters.length) {
                const firstElement = cloneRouters.shift() // 取出第一个路由
                if (
                    firstElement?.meta?.roles?.find((el: string[]) => {
                        return el.includes('*') || el.includes(role) // 如果角色包含 '*' 或传入的角色
                    })
                )
                    return { name: firstElement.name } // 返回符合条件的路由的名字
                if (firstElement?.children) {
                    cloneRouters.push(...firstElement.children) // 如果有子路由，加入待查找队列
                }
            }
            return null // 如果未找到符合条件的路由，返回 null
        }
        // 你可以根据需要添加任何权限规则
        // You can add any rules you want
    }
}
