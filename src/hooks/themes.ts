import { computed } from 'vue' // 从 vue 中导入 computed 用于创建计算属性
import { useAppStore } from '@/store' // 导入项目的状态管理 store

// 自定义钩子函数，用于处理主题的切换和获取
export default function useThemes() {
    const appStore = useAppStore() // 获取应用的全局状态管理 store

    // 计算属性，用于判断当前主题是否为暗黑模式
    const isDark = computed(() => {
        return appStore.theme === 'dark' // 判断 store 中的 theme 是否为 'dark'
    })

    // 返回计算属性
    return {
        isDark // 当前是否为暗黑模式
    }
}
