import { App } from 'vue' // 从 vue 中导入 App 类型，用于定义插件的安装方法
import permission from './permission' // 导入自定义的权限指令
import role from './role' // 导入自定义的角色指令

// 定义一个 Vue 插件
export default {
    install(Vue: App) {
        // 在 Vue 实例上注册自定义指令
        Vue.directive('role', role) // 将 'role' 指令与导入的权限处理逻辑关联起来
        Vue.directive('permission', permission) // 将 'permission' 指令与导入的权限处理逻辑关联起来
    }
}
