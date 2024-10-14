import { computed } from 'vue' // 从 vue 中导入计算属性
import { EChartsOption } from 'echarts' // 从 echarts 中导入 EChartsOption 类型
import { useAppStore } from '@/store' // 导入应用状态管理的 store

// 代码提示注释，导入 ECharts 的配置项类型
// import { SeriesOption } from 'echarts';
// 由于 ECharts 的配置项很多，使用这个注释可以提供较为方便的代码提示。
// 在使用 vue 时要注意响应式问题，确保对应的函数能够被触发，TypeScript 不会报错，并且代码书写方便。

// 定义一个函数类型接口，接收一个布尔类型参数（是否为暗黑模式），返回 EChartsOption 类型的对象
interface optionsFn {
    (isDark: boolean): EChartsOption
}

// 定义一个自定义的钩子函数，接收一个生成图表配置的函数作为参数
export default function useChartOption(sourceOption: optionsFn) {
    const appStore = useAppStore() // 获取应用的状态管理
    const isDark = computed(() => {
        return appStore.theme === 'dark' // 通过计算属性判断当前主题是否为暗黑模式
    })

    // echarts 支持主题构建工具：https://echarts.apache.org/zh/theme-builder.html
    // 这里没有使用主题
    // TODO: 未来可能需要实现 ECharts 主题支持

    // 通过计算属性动态生成 ECharts 的配置项，依赖于当前是否为暗黑模式
    const chartOption = computed<EChartsOption>(() => {
        return sourceOption(isDark.value) // 调用传入的函数生成 ECharts 配置
    })

    // 返回图表配置
    return {
        chartOption // 暴露计算属性 chartOption
    }
}
