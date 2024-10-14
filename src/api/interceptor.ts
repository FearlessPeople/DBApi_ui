import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Message, Modal } from '@arco-design/web-vue'
import { useUserStore } from '@/store'
import { getToken } from '@/utils/auth'

export interface HttpResponse<T = unknown> {
    status: number
    message: string
    code: number
    data: T
}

if (import.meta.env.VITE_API_BASE_URL) {
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
}

// 请求拦截器
axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // let each request carry token
        // this example using the JWT token
        // Authorization is a custom headers key
        // please modify it according to the actual situation
        const token = getToken()
        if (token) {
            if (!config.headers) {
                config.headers = {}
            }
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        // do something
        return Promise.reject(error)
    }
)
// 响应拦截器
axios.interceptors.response.use(
    (response: AxiosResponse<any>) => {
        // 检查 Content-Type 是否为文件流类型
        const contentType = response.headers['content-type']

        // 如果返回的是文件流，则不按 res.code 处理，直接返回响应
        if (
            (contentType && contentType.includes('application/octet-stream')) ||
            contentType.includes('image') ||
            contentType === 'blob'
        ) {
            return response
        }

        // 否则按照正常 JSON 响应处理
        const res = response.data

        // 处理非 200 响应
        if (res.code !== 200) {
            Message.error({
                content: res.message || 'Error',
                duration: 5 * 1000
            })

            // 检查特定错误码，处理登录失效等场景
            if ([50008, 50012, 50014].includes(res.code) && response.config.url !== '/api/user/info') {
                Modal.error({
                    title: 'Confirm logout',
                    content: 'You have been logged out, you can cancel to stay on this page, or log in again',
                    okText: 'Re-Login',
                    async onOk() {
                        const userStore = useUserStore()
                        await userStore.logout()
                        window.location.reload()
                    }
                })
            }
            return Promise.reject(new Error(res.message || 'Error'))
        }

        // 正常返回数据
        return res
    },
    error => {
        const status = error.response ? error.response.status : null

        // 处理特定 HTTP 状态码
        switch (status) {
            case 401:
                Modal.warning({
                    title: '登录失效',
                    content: '您的登录状态已失效，请重新登陆.',
                    okText: '去登录...',
                    async onOk() {
                        const userStore = useUserStore()
                        await userStore.logout()
                        window.location.reload()
                    }
                })
                break

            case 403:
                Message.error({
                    content: '无权限访问该资源。',
                    duration: 5 * 1000
                })
                break

            case 404:
                Message.error({
                    content: '请求的资源不存在。',
                    duration: 5 * 1000
                })
                break

            case 500:
                Message.error({
                    content: '服务器内部错误，请稍后再试。',
                    duration: 5 * 1000
                })
                break

            default:
                Message.error({
                    content: error.message || 'Request Error',
                    duration: 5 * 1000
                })
        }

        return Promise.reject(error)
    }
)
