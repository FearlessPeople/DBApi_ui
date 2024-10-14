// 任意对象的接口，键为字符串，值为未知类型
export interface AnyObject {
    [key: string]: unknown
}

// 选项的接口，通常用于下拉列表或选择框中的选项
export interface Options {
    value: unknown // 选项的值，可以是任何类型
    label: string // 选项的显示标签，通常为字符串
}

// 树形节点选项接口，继承自 Options，增加了子节点的支持
export interface NodeOptions extends Options {
    children?: NodeOptions[] // 可选，表示该节点的子节点列表
}

// GET 请求参数的接口
export interface GetParams {
    body: null // GET 请求通常不包含请求体
    type: string // 请求的类型
    url: string // 请求的 URL
}

// POST 请求数据的接口
export interface PostData {
    body: string // POST 请求的请求体，通常为字符串
    type: string // 请求的类型
    url: string // 请求的 URL
}

// 分页相关的接口，定义分页组件的属性
export interface Pagination {
    current: number // 当前页码
    pageSize: number // 每页显示的记录数
    total?: number // 可选，总记录数
    showJumper?: boolean // 可选，是否显示跳转页码的输入框
    autoAdjust?: boolean // 可选，是否在数据条数变化时自动调整页码
    showTotal?: boolean // 可选，是否显示总记录数
    showMore?: boolean // 可选，是否显示更多按钮
    showPageSize?: boolean // 可选，是否显示每页记录数的选择器
    pageSizeOptions?: Array<number> // 可选，分页选择器的可选项数组
}

// 时间范围类型，表示一对时间字符串
export type TimeRanger = [string, string]

// 通用图表数据接口，定义图表的横轴和数据
export interface GeneralChart {
    xAxis: string[] // 图表的横轴数据，通常为字符串数组
    data: Array<{ name: string; value: number[] }> // 图表的数据，包含名称和数值
}
