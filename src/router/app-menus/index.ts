import { appRoutes, appExternalRoutes } from '../routes' // 导入应用路由配置和外部路由配置

// 合并应用路由和外部路由
const mixinRoutes = [...appRoutes, ...appExternalRoutes]

// 根据合并后的路由配置生成客户端菜单
const appClientMenus = mixinRoutes.map(el => {
    const { name, path, meta, redirect, children } = el // 解构路由配置项
    return {
        name, // 菜单项名称
        path, // 路由路径
        meta, // 路由元信息
        redirect, // 重定向路径
        children // 子路由
    }
})

export default appClientMenus // 导出客户端菜单配置
