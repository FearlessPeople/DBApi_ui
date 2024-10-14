import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        roles?: string[] // 控制哪些角色可以访问该页面
        permissions?: string[] // 控制哪些权限点可以访问该页面
        requiresAuth: boolean // 是否需要登录才能访问当前页面（每个路由都必须声明）
        icon?: string // 在侧边菜单中显示的图标
        locale?: string // 在侧边菜单和面包屑中显示的本地化名称
        hideInMenu?: boolean // 如果为 true，则不在侧边菜单中显示
        hideChildrenInMenu?: boolean // 如果为 true，则子菜单不在侧边菜单中显示
        activeMenu?: string // 如果设置了名称，则菜单将根据您设置的名称高亮显示
        order?: number // 排序路由菜单项。如果设置了键，值越高越靠前
        noAffix?: boolean // 如果设置为 true，则标签不会固定在标签栏中
        ignoreCache?: boolean // 如果设置为 true，则页面不会被缓存
    }
}
