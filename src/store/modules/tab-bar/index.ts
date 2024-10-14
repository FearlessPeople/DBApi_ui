import type { RouteLocationNormalized } from 'vue-router' // 导入 Vue Router 的路由类型
import { defineStore } from 'pinia' // 导入 defineStore 方法，用于定义 Pinia store
import {
    DEFAULT_ROUTE, // 默认路由
    DEFAULT_ROUTE_NAME, // 默认路由名称
    REDIRECT_ROUTE_NAME // 重定向路由名称
} from '@/router/constants' // 从路由常量中导入
import { isString } from '@/utils/is' // 导入用于检查字符串类型的工具函数
import { TabBarState, TagProps } from './types' // 导入 TabBar 状态和标签属性类型

// 格式化标签
const formatTag = (route: RouteLocationNormalized): TagProps => {
    const { name, meta, fullPath, query } = route // 解构路由对象
    return {
        title: meta.locale || '', // 标签标题，默认为空
        name: String(name), // 标签名称
        fullPath, // 标签完整路径
        query, // 标签查询参数
        ignoreCache: meta.ignoreCache // 是否忽略缓存
    }
}

// 禁止列表
const BAN_LIST = [REDIRECT_ROUTE_NAME] // 包含需要排除的路由名称

// 定义 Pinia store
const useAppStore = defineStore('tabBar', {
    state: (): TabBarState => ({
        cacheTabList: new Set([DEFAULT_ROUTE_NAME]), // 缓存标签列表，初始包含默认路由
        tagList: [DEFAULT_ROUTE] // 标签列表，初始包含默认路由
    }),

    getters: {
        // 获取标签列表
        getTabList(): TagProps[] {
            return this.tagList
        },
        // 获取缓存列表
        getCacheList(): string[] {
            return Array.from(this.cacheTabList) // 将缓存标签列表转换为数组
        }
    },

    actions: {
        // 更新标签列表
        updateTabList(route: RouteLocationNormalized) {
            if (BAN_LIST.includes(route.name as string)) return // 如果路由名称在禁止列表中，返回
            this.tagList.push(formatTag(route)) // 格式化并添加标签到标签列表
            if (!route.meta.ignoreCache) {
                this.cacheTabList.add(route.name as string) // 如果不忽略缓存，则添加到缓存列表
            }
        },
        // 删除标签
        deleteTag(idx: number, tag: TagProps) {
            this.tagList.splice(idx, 1) // 从标签列表中删除指定索引的标签
            this.cacheTabList.delete(tag.name) // 从缓存列表中删除标签名称
        },
        // 添加缓存
        addCache(name: string) {
            if (isString(name) && name !== '') this.cacheTabList.add(name) // 如果名称为非空字符串，则添加到缓存列表
        },
        // 删除缓存
        deleteCache(tag: TagProps) {
            this.cacheTabList.delete(tag.name) // 从缓存列表中删除标签名称
        },
        // 刷新标签列表
        freshTabList(tags: TagProps[]) {
            this.tagList = tags // 更新标签列表
            this.cacheTabList.clear() // 清空缓存列表
            // 要先判断ignoreCache
            this.tagList
                .filter(el => !el.ignoreCache) // 过滤掉需要忽略缓存的标签
                .map(el => el.name) // 提取标签名称
                .forEach(x => this.cacheTabList.add(x)) // 添加到缓存列表
        },
        // 重置标签列表
        resetTabList() {
            this.tagList = [DEFAULT_ROUTE] // 将标签列表重置为默认路由
            this.cacheTabList.clear() // 清空缓存列表
            this.cacheTabList.add(DEFAULT_ROUTE_NAME) // 将默认路由名称添加到缓存列表
        }
    }
})

export default useAppStore
