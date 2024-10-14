import { computed } from 'vue' // 从 vue 中导入 computed 以创建计算属性
import { useI18n } from 'vue-i18n' // 从 vue-i18n 中导入 useI18n，用于国际化
import { Message } from '@arco-design/web-vue' // 从 arco-design 库中导入 Message 用于显示消息提示

// 定义一个自定义钩子函数，用于处理语言的切换逻辑
export default function useLocale() {
    const i18 = useI18n() // 获取 vue-i18n 提供的 i18n 实例
    const currentLocale = computed(() => {
        return i18.locale.value // 通过计算属性获取当前的语言
    })

    // 切换语言
    const changeLocale = (value: string) => {
        if (i18.locale.value === value) {
            return // 如果当前语言和传入的语言相同，直接返回
        }
        i18.locale.value = value // 更新 i18n 的语言
        localStorage.setItem('arco-locale', value) // 将选择的语言存储到 localStorage 中
        Message.success(i18.t('navbar.action.locale')) // 显示语言切换成功的提示信息
    }

    // 返回当前语言和切换语言的方法
    return {
        currentLocale, // 当前语言
        changeLocale // 切换语言的方法
    }
}
