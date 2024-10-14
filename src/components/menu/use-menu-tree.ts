import { computed } from 'vue'
import { RouteRecordRaw, RouteRecordNormalized } from 'vue-router'
import usePermission from '@/hooks/permission' // 引入权限管理钩子
import { useAppStore } from '@/store' // 引入应用状态管理
import appClientMenus from '@/router/app-menus' // 引入客户端菜单配置
import { cloneDeep } from 'lodash' // 引入 lodash 的 cloneDeep 方法

export default function useMenuTree() {
    const permission = usePermission() // 获取权限管理实例
    const appStore = useAppStore() // 获取应用状态管理实例

    // 计算属性，根据是否从服务器获取菜单来决定使用哪个菜单配置
    const appRoute = computed(() => {
        if (appStore.menuFromServer) {
            return appStore.appAsyncMenus // 从服务器获取的菜单
        }
        return appClientMenus // 客户端预定义的菜单
    })

    // 计算属性，生成菜单树
    const menuTree = computed(() => {
        // 深拷贝路由配置，避免直接修改原数据
        const copyRouter = cloneDeep(appRoute.value) as RouteRecordNormalized[]

        // 按照 meta.order 属性对菜单项进行排序
        copyRouter.sort((a: RouteRecordNormalized, b: RouteRecordNormalized) => {
            return (a.meta.order || 0) - (b.meta.order || 0)
        })

        // 遍历路由配置并生成菜单树
        function travel(_routes: RouteRecordRaw[], layer: number) {
            if (!_routes) return null

            // 收集菜单项
            const collector: any = _routes.map(element => {
                // 检查是否有访问权限
                if (!permission.accessRouter(element)) {
                    return null // 没有访问权限则忽略该项
                }

                // 处理叶子节点
                if (element.meta?.hideChildrenInMenu || !element.children) {
                    element.children = [] // 没有子菜单的叶子节点
                    return element
                }

                // 过滤掉 hideInMenu 为 true 的子菜单
                element.children = element.children.filter(x => x.meta?.hideInMenu !== true)

                // 递归处理子菜单
                const subItem = travel(element.children, layer + 1)

                if (subItem.length) {
                    element.children = subItem
                    return element
                }

                // 处理层级大于 1 的菜单项
                if (layer > 1) {
                    element.children = subItem
                    return element
                }

                // 如果 meta.hideInMenu 为 false，则返回该菜单项
                if (element.meta?.hideInMenu === false) {
                    return element
                }

                return null // 其他情况返回 null
            })

            // 过滤掉 null 值
            return collector.filter(Boolean)
        }

        // 生成菜单树
        return travel(copyRouter, 0)
    })

    // 返回计算属性 menuTree
    return {
        menuTree
    }
}
