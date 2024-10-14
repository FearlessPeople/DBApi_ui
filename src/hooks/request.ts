import { ref, UnwrapRef } from 'vue' // 从 vue 中导入 ref 和 UnwrapRef，用于创建响应式数据
import { AxiosResponse } from 'axios' // 从 axios 中导入 AxiosResponse，用于定义接口响应的类型
import { HttpResponse } from '@/api/interceptor' // 导入项目中定义的 HttpResponse 类型
import useLoading from './loading' // 导入自定义的 useLoading 钩子函数

// 用于发送请求获取列表数据的钩子函数
// 不要使用 async function，async function 中无法正常工作
// 使用 bind 函数来添加参数
// 示例：useRequest(api.bind(null, {}))

export default function useRequest<T>(
    api: () => Promise<AxiosResponse<HttpResponse>>, // 接收一个返回 Promise 的 API 函数
    defaultValue = [] as unknown as T, // 默认值，作为响应数据的初始值
    isLoading = true // 是否在初始时显示加载状态
) {
    const { loading, setLoading } = useLoading(isLoading) // 使用自定义的 useLoading 钩子管理加载状态
    const response = ref<T>(defaultValue) // 定义响应式的 response，存储请求返回的数据，默认值为传入的 defaultValue

    // 执行 API 请求
    api()
        .then(res => {
            response.value = res.data as unknown as UnwrapRef<T> // 将返回的数据赋值给 response，使用 UnwrapRef 解除响应式包装
        })
        .finally(() => {
            setLoading(false) // 请求完成后，无论成功还是失败，关闭加载状态
        })

    // 返回加载状态和响应数据
    return { loading, response }
}
