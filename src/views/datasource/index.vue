<template>
    <div class="container">
        <Breadcrumb :items="['系统管理', '角色管理']" />
        <a-card class="general-card" title="角色管理">
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
                                <a-form-item field="id" label="角色ID">
                                    <a-input-number v-model="formModel.id" placeholder="请输入角色ID" :min="1" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item field="name" label="角色名称">
                                    <a-input v-model="formModel.name" placeholder="请输入角色名称" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="6">
                                <a-form-item field="remark" label="备注">
                                    <a-input v-model="formModel.remark" placeholder="请输入角色备注" allow-clear />
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
                        <a-button type="primary" @click="showcreateRole" v-permission="['sys:role:add']">
                            <template #icon>
                                <icon-plus />
                            </template>
                            {{ $t('searchTable.operation.create') }}
                        </a-button>
                        <!-- 新增和更新角色模态框 -->
                        <a-modal
                            v-model:visible="roleModalvisible"
                            title="角色信息"
                            @cancel="handleCancel"
                            @before-ok="handleBeforeOk"
                            draggable
                        >
                            <a-form ref="roleModalFormRef" :model="roleModalForm">
                                <a-form-item
                                    field="name"
                                    label="角色名"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '角色名不能为空'
                                        },
                                        {
                                            minLength: 3,
                                            maxLength: 20,
                                            message: '角色名长度为3-20个字符'
                                        },
                                        {
                                            match: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
                                            message: '角色名只能包含汉字、字母（大小写）、数字，不能包含特殊字符。'
                                        }
                                    ]"
                                    :validate-trigger="['blur']"
                                >
                                    <a-input v-model="roleModalForm.name" placeholder="请输入角色名" />
                                </a-form-item>
                                <a-form-item field="remark" label="备注">
                                    <a-textarea v-model="roleModalForm.remark" placeholder="请输入角色备注" allow-clear />
                                </a-form-item>
                            </a-form>
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
                    <a-table-column title="#" data-index="" width="50">
                        <template #cell="{ rowIndex }">
                            {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
                        </template>
                    </a-table-column>
                    <a-table-column title="角色ID" data-index="id" width="80"></a-table-column>
                    <a-table-column title="角色名称" data-index="name" width="100"></a-table-column>
                    <a-table-column title="备注" data-index="remark" ellipsis="true" tooltip="true"></a-table-column>
                    <a-table-column title="创建时间" data-index="createTime"></a-table-column>
                    <a-table-column title="更新时间" data-index="updateTime"></a-table-column>
                    <a-table-column title="操作">
                        <template #cell="{ record }">
                            <a-tooltip content="更新角色信息">
                                <a-link @click="updateRoleFirm(record)" v-permission="['sys:role:edit']">
                                    <template #icon>
                                        <icon-edit />
                                    </template>
                                    编辑
                                </a-link>
                            </a-tooltip>
                            <a-tooltip content="给该角色分配权限">
                                <a-link @click="setPermission(record)" v-permission="['sys:role:permission']">
                                    <template #icon>
                                        <icon-safe />
                                    </template>
                                    权限设置
                                </a-link>
                            </a-tooltip>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
        </a-card>
        <rolePermission v-model:visible="isDrawerVisible" v-model:roleData="roleData" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, getCurrentInstance, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/loading'
import { pageRoleList, createRole, deleteRole, editRole, RoleParams, RoleRecord } from '@/api/sys-role-manager'
import { Pagination } from '@/types/global'
import { Message } from '@arco-design/web-vue'
import rolePermission from './components/role-permission.vue'

const { proxy } = getCurrentInstance()!
const baseURL = proxy?.$baseURL
// 定义表格大小类型
type SizeProps = 'mini' | 'small' | 'medium' | 'large'

// 生成表单模型的初始值
const generateFormModel = () => {
    return {
        id: undefined,
        name: '',
        remark: ''
    }
}

// 使用自定义的加载状态 Hook
const { loading, setLoading } = useLoading(true)
// 国际化函数
const { t } = useI18n()
// 定义渲染数据的响应式变量
const renderData = ref<RoleRecord[]>([])
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

// 获取数据的异步函数
const fetchData = async (params: RoleParams = { current: 1, pageSize: 10 }) => {
    setLoading(true) // 开始加载
    try {
        const { data } = await pageRoleList(params) // 调用 API 获取数据
        renderData.value = data.records // 设置渲染数据
        pagination.current = params.current // 更新当前页
        pagination.total = data.total // 更新总条数
    } catch (err) {
        // 错误处理，可以使用 errorHandler 或其他方式
    } finally {
        setLoading(false) // 加载结束
    }
}

// 删除角色
const deleteRoleFirm = async (params: RoleParams) => {
    setLoading(true) // 开始加载
    try {
        if (params.id !== undefined) {
            const res = await deleteRole(Number(params.id)) // 转换为数字并调用
            if (res.status) {
                Message.success(res.message)
            } else {
                Message.error(res.message)
            }
        } else {
            Message.error('角色ID获取错误，无法删除~')
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
    } as unknown as RoleParams)
}
// 分页变化时的处理函数
const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current })
}

const roleModalvisible = ref(false)
const roleModalFormRef = ref()
const roleModalForm = reactive({
    id: undefined,
    name: '',
    remark: ''
})

const handleBeforeOk = async done => {
    try {
        const valid = await roleModalFormRef.value.validate()
        if (valid === undefined) {
            // 验证通过
            const params: RoleRecord = {
                ...roleModalForm
            }
            setLoading(true) // 开始加载
            try {
                if (params.id > 0) {
                    fatchUpdateRole(params)
                } else {
                    fatchCreateRole(params)
                }
                done()
            } catch (err) {
                Message.error(err)
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

// 定义父组件中的控制变量
const isDrawerVisible = ref(false)
const roleData = ref({})

const setPermission = (record: RoleRecord) => {
    isDrawerVisible.value = true
    roleData.value = record
}

const resetRoleModal = () => {
    roleModalForm.id = undefined
    roleModalForm.name = ''
    roleModalForm.remark = ''
}

const handleCancel = () => {
    resetRoleModal()
    roleModalvisible.value = false
}
const showcreateRole = () => {
    roleModalvisible.value = true
}

// 请求后端新增角色接口
const fatchCreateRole = async (params: RoleRecord) => {
    const data = await createRole(params) // 调用 API 获取数据
    if (data.status) {
        Message.success(data.message)
        resetRoleModal()
    } else {
        Message.error(data.message)
    }
}
// 请求后端更新角色接口
const fatchUpdateRole = async (params: RoleRecord) => {
    const data = await editRole(params) // 调用 API 获取数据
    if (data.status) {
        Message.success(data.message)
        search()
        resetRoleModal()
        roleModalvisible.value = false
    } else {
        Message.error(data.message)
    }
}

// 更新角色
const updateRoleFirm = async (params: RoleRecord) => {
    setLoading(true) // 开始加载
    try {
        roleModalForm.name = params.name
        roleModalForm.remark = params.remark
        roleModalForm.id = params.id
        roleModalvisible.value = true
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
