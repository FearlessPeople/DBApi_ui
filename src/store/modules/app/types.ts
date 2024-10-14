import type { RouteRecordNormalized } from 'vue-router'

// 定义应用状态的接口，描述应用中可用的状态属性
export interface AppState {
    theme: string // 当前主题（如 'dark' 或 'light'）
    colorWeak: boolean // 是否启用弱化颜色模式
    navbar: boolean // 是否显示导航栏
    menu: boolean // 是否显示菜单
    topMenu: boolean // 是否显示顶部菜单
    hideMenu: boolean // 是否隐藏菜单
    menuCollapse: boolean // 菜单是否折叠
    footer: boolean // 是否显示页脚
    themeColor: string // 主题颜色
    menuWidth: number // 菜单的宽度
    globalSettings: boolean // 是否显示全局设置按钮
    device: string // 当前设备类型（'desktop' 或 'mobile'）
    tabBar: boolean // 是否显示标签栏
    menuFromServer: boolean // 菜单是否来自服务器
    serverMenu: RouteRecordNormalized[] // 从服务器获取的菜单，格式为路由记录数组
    [key: string]: unknown // 允许存储其他未明确定义的属性
}
