// 定义目标窗口的上下文类型，可能的取值为 '_self'、'_parent'、'_blank'、'_top'
type TargetContext = '_self' | '_parent' | '_blank' | '_top'

// 打开新窗口函数
export const openWindow = (
    url: string, // 要打开的URL地址
    opts?: { target?: TargetContext; [key: string]: any } // 选项参数，包含窗口目标和其他窗口特性
) => {
    const { target = '_blank', ...others } = opts || {} // 默认情况下，target 为 '_blank'，其余选项通过解构获取
    window.open(
        url, // 传入的URL
        target, // 打开的窗口目标
        // 将其他窗口特性选项转换为字符串形式，并用逗号分隔
        Object.entries(others)
            .reduce((preValue: string[], curValue) => {
                const [key, value] = curValue
                return [...preValue, `${key}=${value}`] // 将 key=value 格式的特性添加到数组中
            }, [])
            .join(',') // 将数组转化为以逗号分隔的字符串
    )
}

// 用于匹配有效URL的正则表达式，支持 http, https, ftp 协议，不支持 mailto
export const regexUrl = new RegExp(
    '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?' +
        '(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
        '(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*' +
        '[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*' +
        '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
    'i' // 'i' 表示不区分大小写
)

export default null
