/**
 * 使用发布订阅模式去进行路由变化的管理，避免单独监听路由造成的渲染性能浪费。
 * Listening to routes alone would waste rendering performance. Use the publish-subscribe model for distribution management.
 */
import mitt, { Handler } from 'mitt' // 引入 mitt 库，用于发布订阅模式
import type { RouteLocationNormalized } from 'vue-router' // 引入 vue-router 的 RouteLocationNormalized 类型

// 创建一个 mitt 实例，用作事件总线
const emitter = mitt()

// 创建一个 Symbol 常量作为事件的唯一标识符
const key = Symbol('ROUTE_CHANGE')

// 存储最新的路由信息
let latestRoute: RouteLocationNormalized

/**
 * 设置路由变化事件的发布者
 * @param to - 当前的路由信息
 */
export function setRouteEmitter(to: RouteLocationNormalized) {
    // 发布路由变化事件，传递路由信息
    emitter.emit(key, to)
    // 更新最新的路由信息
    latestRoute = to
}

/**
 * 监听路由变化事件的订阅者
 * @param handler - 路由变化时执行的处理函数
 * @param immediate - 是否立即执行处理函数，如果为 true 且有最新的路由信息，立即调用处理函数
 */
export function listenerRouteChange(handler: (route: RouteLocationNormalized) => void, immediate = true) {
    // 注册路由变化的事件监听
    emitter.on(key, handler as Handler)

    // 如果 immediate 为 true 且存在最新的路由信息，则立即执行传入的处理函数
    if (immediate && latestRoute) {
        handler(latestRoute)
    }
}

/**
 * 移除路由变化的事件监听器
 */
export function removeRouteListener() {
    // 移除路由变化的事件监听
    emitter.off(key)
}
