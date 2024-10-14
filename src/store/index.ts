import { createPinia } from 'pinia' // 导入 createPinia 方法，用于创建 Pinia 实例
import useAppStore from './modules/app' // 导入 app 模块中的 store
import useUserStore from './modules/user' // 导入 user 模块中的 store
import useTabBarStore from './modules/tab-bar' // 导入 tab-bar 模块中的 store

// 创建 Pinia 实例
const pinia = createPinia()

// 导出各个 store 模块，供其他组件或模块使用
export { useAppStore, useUserStore, useTabBarStore }

// 默认导出 Pinia 实例
export default pinia
