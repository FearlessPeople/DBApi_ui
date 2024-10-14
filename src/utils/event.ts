// 添加事件监听器
export function addEventListen(
    target: Window | HTMLElement, // 事件目标，可能是 window 对象或 HTML 元素
    event: string, // 监听的事件类型（如 'click'，'scroll' 等）
    handler: EventListenerOrEventListenerObject, // 事件处理函数
    capture = false // 是否在捕获阶段触发事件，默认为冒泡阶段
) {
    // 检查目标是否具有 addEventListener 方法并且该方法是函数
    if (target.addEventListener && typeof target.addEventListener === 'function') {
        // 添加事件监听器
        target.addEventListener(event, handler, capture)
    }
}

// 移除事件监听器
export function removeEventListen(
    target: Window | HTMLElement, // 事件目标，可能是 window 对象或 HTML 元素
    event: string, // 要移除的事件类型
    handler: EventListenerOrEventListenerObject, // 事件处理函数
    capture = false // 是否在捕获阶段移除事件监听，默认为冒泡阶段
) {
    // 检查目标是否具有 removeEventListener 方法并且该方法是函数
    if (target.removeEventListener && typeof target.removeEventListener === 'function') {
        // 移除事件监听器
        target.removeEventListener(event, handler, capture)
    }
}
