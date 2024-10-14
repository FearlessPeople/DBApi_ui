import { ref } from 'vue' // 从 vue 中导入 ref，用于定义响应式数据

// 定义一个自定义钩子函数，用于管理加载状态
// initValue 默认参数为 false，表示初始加载状态为 false（不加载）
export default function useLoading(initValue = false) {
    const loading = ref(initValue) // 定义响应式的 loading 状态，初始值为传入的 initValue

    // 设置加载状态为指定的布尔值
    const setLoading = (value: boolean) => {
        loading.value = value // 将传入的 value 赋值给 loading
    }

    // 切换加载状态
    const toggle = () => {
        loading.value = !loading.value // 将 loading 状态取反
    }

    // 返回 loading 相关的状态和方法
    return {
        loading, // 当前的加载状态
        setLoading, // 设置加载状态的方法
        toggle // 切换加载状态的方法
    }
}
