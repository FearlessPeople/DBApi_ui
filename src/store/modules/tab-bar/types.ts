export interface TagProps {
    title: string // 标签的标题，通常在菜单或面包屑中显示
    name: string // 标签的名称，通常是路由的名称
    fullPath: string // 标签对应的完整路由路径
    query?: any // 可选，路由的查询参数
    ignoreCache?: boolean // 可选，是否忽略页面缓存
}

export interface TabBarState {
    tagList: TagProps[] // 标签列表，包含多个标签项
    cacheTabList: Set<string> // 缓存标签列表，保存需要缓存的标签名称
}
