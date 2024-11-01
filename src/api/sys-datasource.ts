import type { DescData } from '@arco-design/web-vue/es/descriptions/interface' // 类型导入应放在最前
import axios from 'axios'
import qs from 'query-string'
import { ApiResponse, PageDataResponse } from './types' // 非类型导入在后

export interface DataSourceRecord {
    id?: number
    name?: string
    jdbcUrl?: string
    username?: string
    password?: string
    remark?: string
    status?: 0 | 1 // 状态 0正常 1禁用
    dbType?: 1 // 数据库类型 1:MySQL 2:PostgreSQL 3:Doris
    createTime?: string
    updateTime?: string
}

export interface DataSourceParams extends Partial<DataSourceRecord> {
    current: number // 当前页数
    pageSize: number // 每页条数
}

export interface RoleListRes {
    list: DataSourceRecord[]
    total: number
}

// 所有数据源列表
export function allDbList() {
    return axios.get<DataSourceRecord[]>('/api/db/allList')
}

// 所有数据源列表
export function allTables(id: number) {
    return axios.get<number, ApiResponse<string[]>>(`/api/db/tables?id=${id}`)
}

// 分页数据源列表
export function pageDataSourceList(params: DataSourceParams) {
    return axios.post<PageDataResponse<DataSourceRecord>>(
        '/api/db/list',
        qs.stringify(params), // 将参数序列化为 URL 编码格式
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
            }
        }
    )
}

// 新增数据源
export function createDataSource(params: DataSourceRecord) {
    return axios.post<any, ApiResponse<string>>('/api/db/add', params)
}

// 测试数据源
export function testDataSource(params: DataSourceRecord) {
    return axios.post<any, ApiResponse<string>>('/api/db/test', params)
}

// 删除数据源
export function deleteRole(id: number) {
    return axios.get<any, ApiResponse<string>>(`/api/role/delete?id=${id}`)
}

// 更新数据源
export function editDataSource(params: DataSourceRecord) {
    return axios.post<any, ApiResponse<string>>('/api/db/edit', params)
}

// 获取数据源下所有权限
export function getPermissions(params: DataSourceRecord) {
    return axios.post<any, ApiResponse<string>>('/api/role/get-permissions-list', params)
}

// 给数据源设置权限
export function setPermissions(params: DataSourceRecord, checkedKeys: []) {
    // 合并 checkedKeys 到 params 对象中
    const data = {
        ...params,
        permissionIds: checkedKeys
    }
    return axios.post<any, ApiResponse<string>>('/api/role/set-permissions', data)
}

// 获取所有权限
export function allPermissions() {
    return axios.get<any, ApiResponse<string>>('/api/role/all-permissions')
}
