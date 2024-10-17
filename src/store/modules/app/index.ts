import { defineStore } from 'pinia'
import { Notification } from '@arco-design/web-vue'
import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface'
import type { RouteRecordNormalized } from 'vue-router'
import defaultSettings from '@/config/settings.json'
import { getMenuList } from '@/api/user'
import { AppState } from './types'

// 定义应用的状态管理
const useAppStore = defineStore('app', {
    // 定义状态，初始值来自默认配置文件
    state: (): AppState => ({ ...defaultSettings }),

    // 定义派生状态（相当于计算属性）
    getters: {
        // 获取当前应用的所有设置
        appCurrentSetting(state: AppState): AppState {
            return { ...state }
        },
        // 获取当前设备类型（桌面或移动端）
        appDevice(state: AppState) {
            return state.device
        },
        // 获取服务端菜单（动态菜单）
        appAsyncMenus(state: AppState): RouteRecordNormalized[] {
            return state.serverMenu as unknown as RouteRecordNormalized[]
        }
    },

    // 定义各种操作（相当于方法）
    actions: {
        // 更新应用设置
        updateSettings(partial: Partial<AppState>) {
            // 使用Pinia的$patch方法局部更新状态
            this.$patch(partial as any)
        },

        // 切换主题颜色（深色/浅色）
        toggleTheme(dark: boolean) {
            if (dark) {
                this.theme = 'dark' // 设置为深色主题
                document.body.setAttribute('arco-theme', 'dark') // 在body元素上设置主题属性
            } else {
                this.theme = 'light' // 设置为浅色主题
                document.body.removeAttribute('arco-theme') // 移除主题属性
            }
        },

        // 切换设备类型
        toggleDevice(device: string) {
            this.device = device // 更新设备类型（桌面/移动）
        },

        // 控制菜单的显示/隐藏
        toggleMenu(value: boolean) {
            this.hideMenu = value // 设置是否隐藏菜单
        },

        // 异步获取服务端的菜单配置
        async fetchServerMenuConfig() {
            let notifyInstance: NotificationReturn | null = null
            try {
                // 显示加载菜单的提示
                notifyInstance = Notification.info({
                    id: 'menuNotice', // 设置通知的唯一标识符
                    content: 'loading', // 提示内容
                    closable: true // 是否允许关闭
                })
                // 调用API获取菜单数据
                const { data } = await getMenuList()
                this.serverMenu = data // 将菜单数据保存到状态中
                // 显示加载成功的提示
                notifyInstance = Notification.success({
                    id: 'menuNotice',
                    content: 'success',
                    closable: true
                })
            } catch (error) {
                // 出现错误时显示错误提示
                notifyInstance = Notification.error({
                    id: 'menuNotice',
                    content: 'error',
                    closable: true
                })
            }
        },

        // 清空服务端菜单配置
        clearServerMenu() {
            this.serverMenu = [] // 将菜单列表清空
        }
    }
})

export default useAppStore
