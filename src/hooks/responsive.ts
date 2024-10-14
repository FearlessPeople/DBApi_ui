import { onMounted, onBeforeMount, onBeforeUnmount } from 'vue' // 导入 Vue 的生命周期钩子函数
import { useDebounceFn } from '@vueuse/core' // 导入 VueUse 提供的 useDebounceFn 用于防抖处理
import { useAppStore } from '@/store' // 导入项目的状态管理 store
import { addEventListen, removeEventListen } from '@/utils/event' // 导入自定义的事件监听工具函数

const WIDTH = 992 // 设定响应式布局的宽度阈值，参考 arco.design 的响应式断点设置

// 用于判断当前设备是否为移动端设备的函数
function queryDevice() {
    const rect = document.body.getBoundingClientRect() // 获取页面 body 元素的尺寸信息
    return rect.width - 1 < WIDTH // 如果宽度小于设定的阈值（992px），则认为是移动端
}

// 自定义响应式处理的钩子函数
export default function useResponsive(immediate?: boolean) {
    const appStore = useAppStore() // 获取应用的全局状态管理 store

    // 当窗口尺寸变化时的处理函数
    function resizeHandler() {
        if (!document.hidden) {
            // 如果页面未隐藏
            const isMobile = queryDevice() // 判断当前设备是否为移动端
            appStore.toggleDevice(isMobile ? 'mobile' : 'desktop') // 切换设备状态为移动端或桌面端
            appStore.toggleMenu(isMobile) // 根据是否为移动端切换菜单的显示状态
        }
    }

    // 使用防抖处理的函数，确保窗口调整事件不会频繁触发
    const debounceFn = useDebounceFn(resizeHandler, 100) // 使用防抖，延迟 100ms 处理

    // 在组件挂载完成后执行
    onMounted(() => {
        if (immediate) debounceFn() // 如果 immediate 为 true，则立即执行防抖处理的函数
    })

    // 在组件挂载之前添加窗口尺寸变化的监听器
    onBeforeMount(() => {
        addEventListen(window, 'resize', debounceFn) // 监听窗口 resize 事件，绑定防抖函数
    })

    // 在组件卸载之前移除窗口尺寸变化的监听器
    onBeforeUnmount(() => {
        removeEventListen(window, 'resize', debounceFn) // 移除窗口 resize 事件的监听
    })
}
