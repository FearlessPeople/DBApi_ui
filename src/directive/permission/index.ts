import { DirectiveBinding } from 'vue' // 从 vue 中导入 DirectiveBinding 类型，用于指令的绑定
import { useUserStore } from '@/store' // 导入项目中的用户状态管理 store

//  根据权限点检查函数
function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding // 获取指令绑定的值
    const userStore = useUserStore() // 获取用户状态管理 store
    const { permissions } = userStore // 从 store 中获取用户权限点

    if (Array.isArray(value)) {
        // 检查指令绑定的值是否是数组
        if (value.length > 0) {
            const bindingPermissions = value // 获取v-permission绑定的权限值数组
            const userPermissions = permissions // 获取用户的permission权限值

            // 检查v-permission指令绑定的权限点是否在用户权限点列表里
            const hasPermission = bindingPermissions.every(item => userPermissions.includes(item))

            if (!hasPermission && el.parentNode) {
                // 如果没有权限且父节点存在
                el.parentNode.removeChild(el) // 从父节点中移除当前元素

                // 如果没有权限，将当前元素替换为 <span>无权限查看该内容</span> 占位符
                // const span = document.createElement('span')
                // span.textContent = '无权限查看该内容'
                // el.parentNode.replaceChild(span, el)
            }
        }
    } else {
        throw new Error(`v-permission需要权限点数组! 例如 v-permission="['user/list','user/edit']"`) // 如果绑定的值不是数组，则抛出错误
    }
}

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        checkPermission(el, binding) // 在元素挂载时检查权限
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        checkPermission(el, binding) // 在元素更新时检查权限
    }
}
