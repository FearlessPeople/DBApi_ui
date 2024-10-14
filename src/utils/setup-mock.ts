import debug from './env' // 引入环境变量中的 debug 配置

/**
 * 根据 mock 标志和 debug 配置来设置环境
 * @param param - 配置对象
 * @param param.mock - 是否启用 mock 数据，默认为 true
 * @param param.setup - 用于初始化的函数
 */
export default ({ mock, setup }: { mock?: boolean; setup: () => void }) => {
    // 如果 mock 参数不是 false 并且 debug 为 true，则调用 setup 函数
    if (mock !== false && debug) setup()
}

/**
 * 成功响应的数据包装函数
 * @param data - 响应的数据
 * @returns 包装后的响应对象
 */
export const successResponseWrap = (data: unknown) => {
    return {
        data,
        status: 'ok', // 状态为成功
        msg: '请求成功', // 响应消息
        code: 20000 // 响应代码
    }
}

/**
 * 失败响应的数据包装函数
 * @param data - 响应的数据
 * @param msg - 失败的消息
 * @param code - 响应代码，默认为 50000
 * @returns 包装后的响应对象
 */
export const failResponseWrap = (data: unknown, msg: string, code = 50000) => {
    return {
        data,
        status: 'fail', // 状态为失败
        msg, // 失败的消息
        code // 响应代码
    }
}
