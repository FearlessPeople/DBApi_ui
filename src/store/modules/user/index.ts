import { defineStore } from 'pinia' // 导入 defineStore 方法，用于定义 Pinia store
import {
    login as userLogin, // 导入用户登录 API
    logout as userLogout, // 导入用户登出 API
    getUserInfo, // 导入获取用户信息的 API
    LoginData // 导入登录数据类型
} from '@/api/user' // 用户相关的 API 和类型

import { setToken, clearToken } from '@/utils/auth' // 导入设置和清除 Token 的工具函数
import { removeRouteListener } from '@/utils/route-listener' // 导入移除路由监听器的工具函数
import { UserState } from './types' // 导入用户状态的类型定义
import useAppStore from '../app' // 导入应用状态的 store

const useUserStore = defineStore('user', {
    state: (): UserState => ({
        // 定义用户的初始状态
        id: undefined,
        nickname: undefined,
        username: undefined,
        avatar: undefined,
        email: undefined,
        introduction: undefined,
        phoneNumber: undefined,
        createTime: undefined,
        remark: undefined,
        status: undefined,
        isAdmin: undefined,
        isDelete: undefined,
        role: '',
        permissions: []
    }),

    getters: {
        // 返回当前用户的所有信息
        userInfo(state: UserState): UserState {
            return { ...state }
        }
    },

    actions: {
        // 切换用户角色
        switchRoles() {
            return new Promise(resolve => {
                this.role = this.role === 'user' ? 'admin' : 'user' // 切换角色
                resolve(this.role) // 返回切换后的角色
            })
        },

        // 设置用户信息
        setInfo(partial: Partial<UserState>) {
            this.$patch(partial) // 更新用户信息
        },

        // 重置用户信息
        resetInfo() {
            this.$reset() // 重置状态为初始状态
        },

        // 获取用户信息
        async info() {
            const res = await getUserInfo() // 请求用户信息
            this.setInfo(res.data) // 设置用户信息
        },

        // 登录
        async login(loginForm: LoginData) {
            try {
                const res = await userLogin(loginForm) // 执行登录请求
                if (!res.status) {
                    throw res // 如果登录失败，抛出异常
                }
                setToken(res.data.token) // 设置 Token
            } catch (err) {
                clearToken() // 清除 Token
                throw err // 抛出异常
            }
        },

        // 登出后的回调
        logoutCallBack() {
            const appStore = useAppStore()
            this.resetInfo() // 重置用户信息
            clearToken() // 清除 Token
            removeRouteListener() // 移除路由监听器
            appStore.clearServerMenu() // 清除服务器菜单
        },

        // 登出
        async logout() {
            try {
                await userLogout() // 执行登出请求
            } finally {
                this.logoutCallBack() // 执行登出后的回调
            }
        }
    }
})

export default useUserStore
