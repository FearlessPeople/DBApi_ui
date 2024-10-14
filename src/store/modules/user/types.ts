export type RoleType = '' | '*' | 'admin' | 'user'
export interface UserState {
    id?: string // 账号id
    nickname?: string // 昵称
    username?: string // 用户名
    avatar?: string // 头像
    email?: string // 邮箱
    introduction?: string // 介绍
    phoneNumber?: string // 手机号
    createTime?: string // 注册时间
    remark?: string // 备注
    status?: string // 用户状态 0正常 1禁用
    isAdmin?: string // 是否管理员 0是 1否
    isDelete?: string // 是否删除 0是 1否
    role: RoleType // 角色，暂时不用，采用权限点控制
    permissions: string[] // 权限点列表
}
