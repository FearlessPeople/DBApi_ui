<template>
    <div class="container">
        <Breadcrumb :items="['系统管理', '用户管理']" />
        <a-card class="general-card" title="用户管理">
            <!-- 搜索表单 -->
            <a-row>
                <a-col :flex="1">
                    <a-form
                        :model="formModel"
                        :label-col-props="{ span: 6 }"
                        :wrapper-col-props="{ span: 18 }"
                        label-align="left"
                    >
                        <a-row :gutter="16">
                            <a-col :span="6">
                                <a-form-item field="id" label="用户ID">
                                    <a-input-number v-model="formModel.id" placeholder="请输入用户ID" :min="1" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item field="nickname" label="用户昵称">
                                    <a-input v-model="formModel.nickname" placeholder="请输入昵称" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item field="username" label="用户名">
                                    <a-input v-model="formModel.username" placeholder="请输入用户名" allow-clear />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item field="phoneNumber" label="手机号">
                                    <a-input v-model="formModel.phoneNumber" placeholder="请输入用户手机号" allow-clear />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item field="email" label="邮箱">
                                    <a-input v-model="formModel.email" placeholder="请输入邮箱" allow-clear />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </a-col>
                <a-divider style="height: 84px" direction="vertical" />
                <a-col :flex="'86px'" style="text-align: right">
                    <a-space direction="vertical" :size="18">
                        <a-button type="primary" @click="search">
                            <template #icon>
                                <icon-search />
                            </template>
                            {{ $t('searchTable.form.search') }}
                        </a-button>
                        <a-button @click="reset">
                            <template #icon>
                                <icon-refresh />
                            </template>
                            {{ $t('searchTable.form.reset') }}
                        </a-button>
                    </a-space>
                </a-col>
            </a-row>
            <a-divider style="margin-top: 0" />
            <!-- 快捷操作栏 -->
            <a-row style="margin-bottom: 16px">
                <a-col :span="12">
                    <a-space>
                        <a-button type="primary" @click="showCreateUser" v-permission="['sys:user:add']">
                            <template #icon>
                                <icon-plus />
                            </template>
                            {{ $t('searchTable.operation.create') }}
                        </a-button>
                        <!-- 新增和更新用户模态框 -->
                        <a-modal
                            v-model:visible="userModalvisible"
                            title="用户信息"
                            @cancel="handleUserCancel"
                            @before-ok="handleUserOk"
                            draggable
                        >
                            <a-form ref="userModalFormRef" :model="userModalForm">
                                <a-form-item
                                    field="nickname"
                                    label="昵称"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '昵称不能为空'
                                        }
                                    ]"
                                    :validate-trigger="['blur']"
                                >
                                    <a-input v-model="userModalForm.nickname" placeholder="请输入昵称" />
                                </a-form-item>
                                <a-form-item
                                    field="username"
                                    label="用户名"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '用户名不能为空'
                                        },
                                        {
                                            minLength: 3,
                                            maxLength: 20,
                                            message: '用户名必须在3-20个（字母或数字）字符内'
                                        },
                                        {
                                            match: /^[A-Za-z0-9]+$/,
                                            message: '只能包含字母和数字'
                                        }
                                    ]"
                                    :validate-trigger="['blur']"
                                >
                                    <a-input v-model="userModalForm.username" placeholder="请输入英文+数字用户名" />
                                </a-form-item>
                                <a-form-item
                                    field="password"
                                    label="密码"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '密码不能为空'
                                        },
                                        {
                                            minLength: 5,
                                            maxLength: 20,
                                            message: '密码必须在5-20个（字母或数字）字符内'
                                        },
                                        {
                                            match: /^[A-Za-z0-9]+$/,
                                            message: '只能包含字母和数字'
                                        }
                                    ]"
                                    :validate-trigger="['blur']"
                                >
                                    <a-input v-model="userModalForm.password" placeholder="请输入密码" />
                                    <template #extra>
                                        <div>更新用户时，请直接输入想修改的密码</div>
                                    </template>
                                </a-form-item>
                                <a-form-item
                                    field="email"
                                    label="邮箱"
                                    :rules="[{ type: 'email', required: true }]"
                                    :validate-trigger="['blur']"
                                >
                                    <a-input v-model="userModalForm.email" placeholder="请输入邮箱" />
                                </a-form-item>
                                <a-form-item
                                    field="phoneNumber"
                                    label="手机号"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '手机号不能为空'
                                        },
                                        {
                                            length: 11,
                                            message: '手机号必须11位数字'
                                        },
                                        {
                                            match: /^[1][3-9][0-9]{9}$/,
                                            message: '手机号格式不正确'
                                        }
                                    ]"
                                    :validate-trigger="['blur']"
                                >
                                    <a-input v-model="userModalForm.phoneNumber" placeholder="请输入手机号" />
                                </a-form-item>
                                <a-form-item field="remark" label="备注">
                                    <a-textarea v-model="userModalForm.remark" placeholder="请输入备注" allow-clear />
                                </a-form-item>
                            </a-form>
                        </a-modal>

                        <!-- 给用户分配角色 -->
                        <a-modal
                            v-model:visible="userRoleModalvisible"
                            title="给用户分配角色"
                            @cancel="handleRoleCancel"
                            @before-ok="handleRoleOk"
                            draggable
                        >
                            <a-select
                                :style="{ width: '100%', height: '60px' }"
                                v-model:model-value="selectRoles"
                                placeholder="请选择角色..."
                                multiple
                                allow-clear
                                :scrollbar="scrollbar"
                            >
                                <a-option v-for="role in roles" :key="role.id" :value="role.id">
                                    {{ role.name }}
                                </a-option>
                            </a-select>
                        </a-modal>
                    </a-space>
                </a-col>

                <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
                    <a-tooltip :content="$t('searchTable.actions.refresh')">
                        <div class="action-icon" @click="search"><icon-refresh size="18" /></div>
                    </a-tooltip>
                    <a-dropdown @select="handleSelectDensity">
                        <a-tooltip :content="$t('searchTable.actions.density')">
                            <div class="action-icon"><icon-line-height size="18" /></div>
                        </a-tooltip>
                        <template #content>
                            <a-doption
                                v-for="item in densityList"
                                :key="item.value"
                                :value="item.value"
                                :class="{ active: item.value === size }"
                            >
                                <span>{{ item.name }}</span>
                            </a-doption>
                        </template>
                    </a-dropdown>
                </a-col>
            </a-row>
            <!-- 搜索结果表 -->
            <a-table
                row-key="id"
                column-resizable
                :loading="loading"
                :pagination="pagination"
                :data="renderData"
                :bordered="false"
                :size="size"
                @page-change="onPageChange"
            >
                <template #columns>
                    <a-table-column title="#" data-index="" :width="50">
                        <template #cell="{ rowIndex }">
                            {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
                        </template>
                    </a-table-column>
                    <a-table-column title="用户ID" data-index="id" :width="80"></a-table-column>
                    <a-table-column title="昵称" data-index="nickname" :width="100"></a-table-column>
                    <a-table-column title="登录名" data-index="username" :width="200">
                        <template #cell="{ record }">
                            <div class="username-block">
                                <a-avatar :size="32" :style="{ cursor: 'pointer' }">
                                    <img :src="`${baseURL}/api/${record.avatar}`" />
                                </a-avatar>
                                <span>{{ record.username }}</span>
                                <a-tag size="small" color="#f53f3f" v-if="record.isAdmin == 0">管理员</a-tag>
                                <span v-else></span>
                            </div>
                        </template>
                    </a-table-column>
                    <a-table-column title="邮箱" data-index="email"></a-table-column>
                    <a-table-column title="电话号码" data-index="phoneNumber"></a-table-column>
                    <a-table-column title="账号状态" data-index="status">
                        <template #cell="{ record }">
                            <a-switch
                                v-permission="['sys:user:add']"
                                :model-value="record.status == 0"
                                checked-color="#00aa31"
                                @change="changeUserStatus(record)"
                            />
                        </template>
                    </a-table-column>
                    <a-table-column title="删除状态" data-index="isDelete">
                        <template #cell="{ record }">
                            <span style="color: rgb(var(--red-4))" v-if="record.isDelete == 0">已删除</span>
                            <span v-else>未删除</span>
                        </template>
                    </a-table-column>
                    <a-table-column title="介绍" data-index="introduction" :ellipsis="true" :tooltip="true"></a-table-column>
                    <a-table-column title="备注" data-index="remark" :ellipsis="true" :tooltip="true"></a-table-column>
                    <a-table-column title="创建时间" data-index="createTime"></a-table-column>
                    <a-table-column title="更新时间" data-index="updateTime"></a-table-column>
                    <a-table-column title="操作">
                        <template #cell="{ record }">
                            <a-tooltip content="更新用户信息">
                                <a-button
                                    class="nav-btn"
                                    v-permission="['sys:user:edit']"
                                    :shape="'circle'"
                                    @click="updateUserFirm(record)"
                                >
                                    <template #icon>
                                        <icon-edit />
                                    </template>
                                </a-button>
                            </a-tooltip>
                            <a-popconfirm :content="`是否删除 ${record.username}用户？`" @ok="deleteUserFirm(record)">
                                <a-tooltip content="删除该用户">
                                    <a-button class="nav-btn" v-permission="['sys:user:delete']" :shape="'circle'">
                                        <template #icon>
                                            <icon-delete />
                                        </template>
                                    </a-button>
                                </a-tooltip>
                            </a-popconfirm>
                            <a-tooltip content="分配角色">
                                <a-button
                                    class="nav-btn"
                                    v-permission="['sys:user:roles']"
                                    :shape="'circle'"
                                    @click="updateUserRoleFirm(record)"
                                >
                                    <template #icon>
                                        <icon-safe />
                                    </template>
                                </a-button>
                            </a-tooltip>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, inject, getCurrentInstance, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/loading'
import {
    queryUserList,
    createUser,
    deleteUser,
    updateUser,
    setUserRole,
    getUserRole,
    switchUserStatus,
    UserParams,
    UserRecord
} from '@/api/sys-user-manager'
import { allRoleList, RoleRecord } from '@/api/sys-role-manager'
import { Pagination } from '@/types/global'
import { Message } from '@arco-design/web-vue'

const { proxy } = getCurrentInstance()!
const baseURL = inject('baseURL')
// 定义表格大小类型
type SizeProps = 'mini' | 'small' | 'medium' | 'large'

// 生成表单模型的初始值
const generateFormModel = () => {
    return {
        id: undefined,
        nickname: '',
        username: '',
        email: '',
        phoneNumber: ''
    }
}
const scrollbar = ref(true)
// 使用自定义的加载状态 Hook
const { loading, setLoading } = useLoading(true)
// 国际化函数
const { t } = useI18n()
// 定义渲染数据的响应式变量
const renderData = ref<UserRecord[]>([])
// 定义表单模型的响应式变量
const formModel = ref(generateFormModel())

// 表格大小，默认为 'medium'
const size = ref<SizeProps>('small')

// 基础分页配置
const basePagination: Pagination = {
    current: 1, // 当前页
    pageSize: 10, // 每页显示条数
    showJumper: true,
    showTotal: true, // 是否显示数据总数
    showMore: true // 是否显示更多按钮
}
// 分页的响应式变量
const pagination = reactive({
    ...basePagination
})
// 密度列表，用于调整表格大小
const densityList = computed(() => [
    {
        name: t('searchTable.size.mini'),
        value: 'mini'
    },
    {
        name: t('searchTable.size.small'),
        value: 'small'
    },
    {
        name: t('searchTable.size.medium'),
        value: 'medium'
    },
    {
        name: t('searchTable.size.large'),
        value: 'large'
    }
])

// 切换用户状态
const changeUserStatus = async (params: UserRecord) => {
    if (params.id !== undefined) {
        const data = await switchUserStatus(params.id)
        if (data.status) {
            Message.success(data.message)
            search()
        } else {
            Message.error(data.message)
        }
    } else {
        Message.error('用户ID无效')
    }
}

// 获取数据的异步函数
const fetchData = async (params: UserParams = { current: 1, pageSize: 10 }) => {
    setLoading(true) // 开始加载
    try {
        const { data } = await queryUserList(params) // 调用 API 获取数据
        renderData.value = data.records // 设置渲染数据
        pagination.current = params.current // 更新当前页
        pagination.total = data.total // 更新总条数
    } catch (err) {
        // 错误处理，可以使用 errorHandler 或其他方式
    } finally {
        setLoading(false) // 加载结束
    }
}

// 删除用户
const deleteUserFirm = async (params: UserParams) => {
    setLoading(true) // 开始加载
    try {
        if (params.id !== undefined) {
            const res = await deleteUser(Number(params.id)) // 转换为数字并调用
            if (res.status) {
                Message.success(res.message)
            } else {
                Message.error(res.message)
            }
        } else {
            Message.error('用户ID获取错误，无法删除~')
        }

        search()
    } catch (err) {
        // 错误处理，可以使用 errorHandler 或其他方式
    } finally {
        setLoading(false) // 加载结束
    }
}

// 重置表单
const reset = () => {
    formModel.value = generateFormModel()
}

// 搜索函数，触发数据获取
const search = () => {
    fetchData({
        ...basePagination,
        ...formModel.value
    } as unknown as UserParams)
}
// 分页变化时的处理函数
const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current })
}

const userModalvisible = ref(false)
const userRoleModalvisible = ref(false)
const userModalFormRef = ref()
const userModalForm = reactive({
    id: -1,
    nickname: '',
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    remark: ''
})

const handleUserOk = async (done: (closed: boolean) => void) => {
    try {
        const valid = await userModalFormRef.value.validate()
        if (valid === undefined) {
            // 验证通过
            const params: UserRecord = {
                ...userModalForm
            }
            setLoading(true) // 开始加载
            try {
                if (params.id !== undefined && params.id > 0) {
                    fatchUpdateUser(params)
                } else {
                    fatchCreateUser(params)
                }
                done(true)
            } catch (err) {
                Message.error('异常')
            } finally {
                setLoading(false) // 加载结束
            }
        } else {
            // 表单验证失败
            done(false) // 不关闭弹窗
        }
    } catch (err) {
        Message.error('表单填写错误')
        done(false) // 验证失败时阻止弹窗关闭
    }
}

const handleUserCancel = () => {
    userModalForm.id = -1
    userModalForm.username = ''
    userModalForm.password = ''
    userModalForm.phoneNumber = ''
    userModalForm.remark = ''
    userModalvisible.value = false
}
const showCreateUser = () => {
    userModalvisible.value = true
}

// 请求后端新增用户接口
const fatchCreateUser = async (params: UserRecord) => {
    const data = await createUser(params) // 调用 API 获取数据
    if (data.status) {
        Message.success(data.message)
        search()
        userModalForm.username = ''
        userModalForm.password = ''
        userModalForm.phoneNumber = ''
    } else {
        Message.error(data.message)
    }
}
// 请求后端更新用户接口
const fatchUpdateUser = async (params: UserRecord) => {
    const data = await updateUser(params) // 调用 API 获取数据
    if (data.status) {
        Message.success(data.message)
        search()
        userModalForm.username = ''
        userModalForm.password = ''
        userModalForm.phoneNumber = ''
    } else {
        Message.error(data.message)
    }
}
// 请求后端更新用户接口
const fatchUserRole = async (params: UserRecord) => {
    const data = await updateUser(params) // 调用 API 获取数据
    if (data.status) {
        Message.success(data.message)
        search()
        userModalForm.username = ''
        userModalForm.password = ''
        userModalForm.phoneNumber = ''
    } else {
        Message.error(data.message)
    }
}

// 更新用户
const updateUserFirm = async (params: UserRecord) => {
    setLoading(true) // 开始加载
    try {
        userModalForm.nickname = params.nickname || ''
        userModalForm.username = params.username || ''
        userModalForm.password = ''
        userModalForm.email = params.email || ''
        userModalForm.phoneNumber = params.phoneNumber || ''
        userModalForm.remark = params.remark || ''
        userModalForm.id = params.id
        userModalvisible.value = true
    } catch (err) {
        // 错误处理，可以使用 errorHandler 或其他方式
    } finally {
        setLoading(false) // 加载结束
    }
}

// 所有角色列表
const currentUserRole = ref<UserRecord | null>(null) // 当前点击的用户信息

const selectRoles = ref() // 用户最终选择的角色列表
const roles = ref()
const roleList = async () => {
    const data = await allRoleList()
    if (data.status) {
        roles.value = data.data
    } else {
        Message.error(data.message)
    }
}
const getUserRoleList = async (params: UserRecord) => {
    const data = await getUserRole(params.id)
    if (data.status) {
        selectRoles.value = data.data.map(item => item.id)
        console.log(selectRoles.value)
    } else {
        Message.error(data.message)
    }
}

const handleRoleOk = async (done: (closed: boolean) => void) => {
    try {
        if (currentUserRole.value) {
            const userId = currentUserRole.value.id
            const rolesToSet = selectRoles.value
            const result = await setUserRole(userId, rolesToSet)
            if (result.status) {
                Message.success('角色更新成功')
                done(true)
            } else {
                Message.error('角色更新失败')
                done(false)
            }
        } else {
            Message.error('用户信息不存在')
            done(false) // 当 currentUserRole 为 null 时，关闭模态框
        }
    } catch (err) {
        Message.error('发生错误，无法更新角色')
        done(false)
    }
}

const handleRoleCancel = () => {
    userModalvisible.value = false
}
// 更新用户角色
const updateUserRoleFirm = async (params: UserRecord) => {
    setLoading(true) // 开始加载
    try {
        roleList()
        getUserRoleList(params)
        userRoleModalvisible.value = true
        currentUserRole.value = params // 存储当前用户信息
    } catch (err) {
        // 错误处理，可以使用 errorHandler 或其他方式
    } finally {
        setLoading(false) // 加载结束
    }
}

// 处理表格密度选择
const handleSelectDensity = (val: string | number | Record<string, any> | undefined, e: Event) => {
    size.value = val as SizeProps
}

onMounted(() => {
    // 初始化获取数据
    fetchData()
})
</script>

<script lang="ts">
export default {
    name: 'UserManager'
}
</script>

<style scoped lang="less">
.container {
    padding: 0 20px 20px 20px;
}

:deep(.arco-table-th) {
    &:last-child {
        .arco-table-th-item-title {
            margin-left: 16px;
        }
    }
}

.action-icon {
    margin-left: 12px;
    cursor: pointer;
}

.active {
    color: #0960bd;
    background-color: #e3f4fc;
}

.nav-btn {
    margin-right: 5px;
}

.setting {
    display: flex;
    align-items: center;
    width: 200px;

    .title {
        margin-left: 12px;
        cursor: pointer;
    }
}

.username-block {
    display: flex;
    align-items: center;

    span {
        margin-left: 5px;
    }
}
</style>
