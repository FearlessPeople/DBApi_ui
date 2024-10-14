import { App, ComponentPublicInstance } from 'vue' // 从 Vue 导入 App 和 ComponentPublicInstance 类型
import axios from 'axios' // 导入 axios 库用于发送 HTTP 请求

// 自定义错误处理函数
export default function handleError(Vue: App, baseUrl: string) {
    // 如果未提供 baseUrl，则直接返回，跳过错误处理设置
    if (!baseUrl) {
        return
    }

    // Vue 的全局错误处理器
    Vue.config.errorHandler = (
        err: unknown, // 错误对象，类型为 unknown，表示可以是任何类型的错误
        instance: ComponentPublicInstance | null, // 发生错误的组件实例，可以为 null
        info: string // 错误信息，通常用于描述错误发生的位置或原因
    ) => {
        // 发送错误信息到指定的服务器
        axios.post(`${baseUrl}/report-error`, {
            err, // 错误对象
            instance, // 出错的组件实例
            info // 错误信息
            // 其他可选信息，例如：
            // location: window.location.href, // 当前页面的 URL
            // message: err.message, // 错误的消息内容
            // stack: err.stack, // 错误的堆栈信息
            // browserInfo: getBrowserInfo(), // 浏览器信息（可以是用户代理或详细的浏览器版本）
            // 用户信息、DOM 信息、URL 信息等可以根据实际需求添加
        })
    }
}
