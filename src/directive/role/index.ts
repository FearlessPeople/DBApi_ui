import { DirectiveBinding } from 'vue' // 从 vue 中导入 DirectiveBinding 类型，用于指令的绑定
import { useUserStore } from '@/store' // 导入项目中的用户状态管理 store

// 根据角色权限检查函数
function checkRole(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding // 获取指令绑定的值
    const userStore = useUserStore() // 获取用户状态管理 store
    const { role } = userStore // 从 store 中获取用户角色

    if (Array.isArray(value)) {
        // 检查指令绑定的值是否是数组
        if (value.length > 0) {
            // 如果数组不为空
            const permissionValues = value // 获取权限值数组

            const hasPermission = permissionValues.includes(role) // 检查用户角色是否在权限值数组中
            if (!hasPermission && el.parentNode) {
                // 如果没有权限且父节点存在
                el.parentNode.removeChild(el) // 从父节点中移除当前元素
            }
        }
    } else {
        throw new Error(`need roles! Like v-permission="['admin','user']"`) // 如果绑定的值不是数组，则抛出错误
    }
}

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        checkRole(el, binding) // 在元素挂载时检查权限
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        checkRole(el, binding) // 在元素更新时检查权限
    }
}
