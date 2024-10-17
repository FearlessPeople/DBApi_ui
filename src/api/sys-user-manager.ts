import type { DescData } from '@arco-design/web-vue/es/descriptions/interface' // 类型导入应放在最前
import axios from 'axios'
import qs from 'query-string'
import { ApiResponse, PageDataResponse } from './types' // 非类型导入在后

export interface SysRole {
    /** 角色id */
    id: number
    /** 角色名称 */
    name: string
    /** 备注 */
    remark: string
    /** 创建时间 */
    createTime: Date
    /** 更新时间 */
    updateTime: Date
    /** 前端传递过来的权限列表id */
    permissionIds?: number[] // optional，因为在 Java 中使用了 @TableField(exist = false)
}

export interface UserRecord {
    id: number
    nickname?: string
    username?: string
    phoneNumber?: string
    email?: string
    status?: 0 | 1 // 状态 0正常 1禁用
    isAdmin?: 0 | 1 // 是否管理员 0管理员  1非管理员
    isDelete?: 0 | 1 // 是否删除 0是 1否
    remark?: string
    createTime?: string
    updateTime?: string
}

export interface UserParams extends Partial<UserRecord> {
    current: number // 当前页数
    pageSize: number // 每页条数
}

export interface UserListRes {
    list: UserRecord[]
    total: number
}

// 查询用户列表
export function queryUserList(params: UserParams) {
    return axios.post<any, ApiResponse<PageDataResponse<UserRecord>>>(
        '/api/user/list',
        qs.stringify(params), // 将参数序列化为 URL 编码格式
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
            }
        }
    )
}

// 新增用户
export function createUser(params: UserRecord) {
    return axios.post<any, ApiResponse<string>>('/api/user/create', params)
}

// 删除用户
export function deleteUser(id: number) {
    return axios.get<any, ApiResponse<string>>(`/api/user/delete?id=${id}`)
}

// 更新用户
export function updateUser(params: UserRecord) {
    return axios.post<any, ApiResponse<string>>('/api/user/update', params)
}

// 切换用户状态
export function switchUserStatus(id: number) {
    return axios.get<any, ApiResponse<string>>(`/api/user/switchStatus?id=${id}`)
}

// 获取用户的角色列表
export function getUserRole(userId: number) {
    return axios.get<any, ApiResponse<SysRole[]>>(`/api/user/roles?id=${userId}`)
}

// 给用户分配角色
export function setUserRole(userId: number, roleIds: []) {
    const data = {
        id: userId,
        roleIds
    }
    return axios.post<ApiResponse<string>>('/api/user/update-roles', data)
}
