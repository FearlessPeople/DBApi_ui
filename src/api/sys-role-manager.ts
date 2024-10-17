import type { DescData } from '@arco-design/web-vue/es/descriptions/interface' // 类型导入应放在最前
import axios from 'axios'
import qs from 'query-string'
import { ApiResponse, PageDataResponse } from './types' // 非类型导入在后

export interface SysPermissions {
    id: number // 角色ID
    name: string // 权限名称
    expression: string // 权限路径表达式
    remark: string // 备注
    status: 0 | 1 // 状态 0正常 1禁用
    createTime: string // 创建时间，字符串格式
    updateTime: string // 更新时间，字符串格式
}

export interface SysPermissionTree {
    key: number // 权限唯一id
    title: string // 权限名称
    expression: string // 权限路径表达式
    remark: string // 备注
    status: 0 | 1 // 状态 0正常 1禁用
    createTime: string // 创建时间
    updateTime: string // 更新时间
    children?: SysPermissionTree[] // 子节点
}

export interface RoleRecord {
    id: number
    name?: string
    remark?: string
    status?: 0 | 1 // 状态 0正常 1禁用
    createTime?: string
    updateTime?: string
}

export interface RoleParams extends Partial<RoleRecord> {
    current: number // 当前页数
    pageSize: number // 每页条数
}

export interface RoleListRes {
    list: RoleRecord[]
    total: number
}

// 分页角色列表
export function pageRoleList(params: RoleParams) {
    return axios.post<PageDataResponse<RoleRecord>>(
        '/api/role/list',
        qs.stringify(params), // 将参数序列化为 URL 编码格式
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
            }
        }
    )
}

// 所有角色列表
export function allRoleList() {
    return axios.post<any, ApiResponse<RoleRecord>>('/api/role/all')
}

// 新增角色
export function createRole(params: RoleRecord) {
    return axios.post<any, ApiResponse<string>>('/api/role/add', params)
}

// 删除角色
export function deleteRole(id: number) {
    return axios.get<any, ApiResponse<string>>(`/api/role/delete?id=${id}`)
}

// 更新角色
export function editRole(params: RoleRecord) {
    return axios.post<any, ApiResponse<string>>('/api/role/edit', params)
}

// 获取角色下所有权限
export function getPermissions(params: RoleRecord) {
    return axios.post<any, ApiResponse<SysPermissions[]>>('/api/role/get-permissions-list', params)
}

// 给角色设置权限
export function setPermissions(params: RoleRecord, checkedKeys: number[]) {
    // 合并 checkedKeys 到 params 对象中
    const data = {
        ...params,
        permissionIds: checkedKeys
    }
    return axios.post<any, ApiResponse<string>>('/api/role/set-permissions', data)
}

// 获取所有权限
export function allPermissions() {
    return axios.get<any, ApiResponse<SysPermissionTree>>('/api/role/all-permissions')
}
