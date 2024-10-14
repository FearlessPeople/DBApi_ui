import { ref } from 'vue' // 从 vue 中导入 ref，用于创建响应式数据

// 自定义钩子函数，用于管理元素的可见性
export default function useVisible(initValue = false) {
    const visible = ref(initValue) // 创建一个响应式变量 visible，初始值为传入的 initValue

    // 设置 visible 的值
    const setVisible = (value: boolean) => {
        visible.value = value // 将 visible 的值设置为传入的 boolean 值
    }

    // 切换 visible 的值
    const toggle = () => {
        visible.value = !visible.value // 将 visible 的值取反
    }

    // 返回响应式变量和操作函数
    return {
        visible, // 当前可见性状态
        setVisible, // 设置可见性状态的函数
        toggle // 切换可见性状态的函数
    }
}
