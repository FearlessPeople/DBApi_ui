import type { DescData } from '@arco-design/web-vue/es/descriptions/interface' // 类型导入应放在最前
import axios from 'axios'
import qs from 'query-string'
import { ApiResponse, PageDataResponse } from './types' // 非类型导入在后

// ApiList 接口
export interface ApiList {
    id: number // 接口ID
    apiName: string // 接口名称
    apiPath: string // 接口路径
    apiDesc: string // 接口描述
    apiGroup: number // 分组
    publishTime?: Date // 发布时间
    status?: number // 接口状态 0发布 1未发布
    createBy?: number // 创建人
    createTime?: Date // 创建时间
    updateTime?: Date // 更新时间
}

// ApiSQL 接口
export interface ApiSql {
    id: number // 自增ID
    apiId: number // 接口ID
    apiSql: string // 接口SQL
    apiParams: string // 接口参数
    apiSqlDesc: string // 接口SQL描述
    datasourceId: number // 数据源ID
    createTime?: Date // 创建时间
    updateTime?: Date // 更新时间
}

// ApiGroup 接口
export interface ApiGroup {
    id: number // 自增ID
    groupName: string // 分组名称
    apiList?: ApiList[] // 接口列表 (可选属性，默认为空数组)
    createTime?: Date // 创建时间
    updateTime?: Date // 更新时间
}

// 接口列表
export function queryApiList(keyWord: string) {
    const params = qs.stringify({ apiName: keyWord })
    return axios.post<PageDataResponse<ApiGroup>>('/api/group/apiList', params)
}
// 新增接口
export function addApiList(apiList: ApiList) {
    return axios.post<PageDataResponse<ApiList>>('/api/apiList/add', apiList)
}
// 根据api_id获取接口详情
export function getApiSql(apiId: number) {
    return axios.get<ApiSql>(`/api/sql/getSql?apiId=${apiId}`)
}

// 获取所有分组列表
export function queryApiGroupList() {
    return axios.get<ApiGroup[]>('/api/group/allList')
}

// 新增分组
export function addApiGroup(group: ApiGroup) {
    return axios.post<any, ApiResponse<string>>('/api/group/add', group)
}

// 修改分组
export function updateApiGroup(group: ApiGroup) {
    return axios.post<any, ApiResponse<string>>('/api/group/edit', group)
}

// 删除分组
export function deleteApiGroup(group: ApiGroup) {
    return axios.get<any, ApiResponse<string>>(`/api/group/delete?id=${group.id}`)
}
