<template>
    <div class="layout-demo">
        <splitpanes style="height: 400px">
            <pane size="15">
                <div class="api-tree">
                    <div>
                        <div class="search-filter">
                            <a-input-search
                                v-model="keyWord"
                                @search="fetchData()"
                                @press-enter="fetchData()"
                                placeholder="输入接口名称模糊搜索..."
                            />
                            <a-tooltip content="刷新接口分组">
                                <a-button type="text" @click="fetchData()">
                                    <template #icon>
                                        <icon-refresh />
                                    </template>
                                </a-button>
                            </a-tooltip>

                            <a-tooltip content="新建接口分组">
                                <a-button type="text" @click="addGroup()">
                                    <template #icon>
                                        <icon-folder-add />
                                    </template>
                                </a-button>
                            </a-tooltip>
                        </div>
                        <div class="search-content">
                            <a-collapse :bordered="false">
                                <a-collapse-item v-for="group in renderData" :key="group.id" :header="group.groupName">
                                    <template #extra>
                                        <a-dropdown trigger="hover">
                                            <a-button type="text">
                                                <icon-more />
                                            </a-button>
                                            <template #content>
                                                <a-doption @click="editGroup(group)">编辑分组</a-doption>
                                                <a-doption @click="deleteGroup(group)">删除分组</a-doption>
                                            </template>
                                        </a-dropdown>
                                    </template>

                                    <!-- 接口列表 -->
                                    <div class="api-list">
                                        <div
                                            v-for="api in group.apiList"
                                            :key="api.id"
                                            @click="openApi(api)"
                                            :class="['api-list-item', { 'selected-item': selectedApiId === api.id }]"
                                        >
                                            <div class="left-content">
                                                <icon-code />
                                                <span class="api-text">{{ api.apiName }}</span>
                                            </div>
                                            <a-button type="text" class="right-icon">
                                                <icon-double-right />
                                            </a-button>
                                        </div>
                                    </div>
                                </a-collapse-item>
                            </a-collapse>
                        </div>
                    </div>
                </div>
            </pane>
            <pane size="85">
                <div class="api-center">
                    <div class="api-header-left" v-if="selectedApi">
                        <span> <icon-code style="color: rgb(var(--green-6))" />{{ selectedApi.apiName }}&nbsp;&nbsp; </span
                        ><a-tag>ID:{{ selectedApi.id }}</a-tag>
                    </div>
                    <a-tabs @change="handleTabChange">
                        <template #extra>
                            <a-button type="primary" @click="createApi()">新建接口</a-button>&nbsp;&nbsp;
                            <a-button size="mini" type="outline" status="success">帮助文档</a-button>
                        </template>
                        <a-tab-pane key="1" title="接口文档">
                            <ApiDoc ref="apiDoc" :api="selectedApi"></ApiDoc>
                        </a-tab-pane>
                        <a-tab-pane key="2" title="接口设计">
                            <ApiDesign ref="apiDesign" :api="selectedApi"></ApiDesign>
                        </a-tab-pane>
                        <a-tab-pane key="3" title="接口调用">
                            <ApiRequest ref="apiRequest" :api="selectedApi"></ApiRequest>
                        </a-tab-pane>
                        <a-tab-pane key="4" title="访问日志"> Content of Tab Panel 4 </a-tab-pane>
                    </a-tabs>
                </div>
            </pane>
        </splitpanes>
    </div>

    <!-- 新增和编辑分组弹窗 -->
    <a-modal
        v-model:visible="groupModalVisible"
        title="分组信息"
        @cancel="handleCancel"
        @before-ok="handleBeforeOk"
        width="600px"
        min-width="600px"
        draggable
    >
        <a-form ref="groupModalFormRef" :model="groupModalForm">
            <a-form-item
                field="groupName"
                label="分组名称"
                :rules="[
                    {
                        required: true,
                        message: '分组名称不能为空'
                    }
                ]"
                :validate-trigger="['blur']"
            >
                <a-input v-model="groupModalForm.groupName" placeholder="请输入分组名称" />
            </a-form-item>
        </a-form>
    </a-modal>

    <!-- 新增接口弹窗 -->
    <a-modal
        v-model:visible="createApiModalVisible"
        title="新增接口"
        @cancel="createHandleCancel"
        @before-ok="craeteHandleBeforeOk"
        draggable
    >
        <a-form :model="createApiForm" ref="createApiFormRef">
            <a-form-item
                field="apiName"
                label="接口名称"
                :rules="[
                    {
                        required: true,
                        message: '接口名称不能为空'
                    }
                ]"
                :validate-trigger="['blur']"
            >
                <a-input v-model="createApiForm.apiName" placeholder="请输入接口名称..." />
            </a-form-item>
            <a-form-item
                field="apiPath"
                label="接口路径"
                :rules="[
                    {
                        required: true,
                        message: '接口路径不能为空'
                    },
                    {
                        match: /^[a-zA-Z\/]+$/,
                        message: '只能包含字母和/'
                    }
                ]"
                :validate-trigger="['blur']"
            >
                <span style="background-color: #e2ffe8">{{ baseURL }}</span>
                <a-input v-model="createApiForm.apiPath" size="mini" placeholder="请输入接口请求路径..." />
            </a-form-item>
            <a-form-item
                field="apiGroup"
                label="接口分组"
                :rules="[
                    {
                        required: true,
                        message: '接口分组不能为空'
                    }
                ]"
                :validate-trigger="['blur']"
            >
                <a-select v-model="createApiForm.apiGroup" placeholder="请选择接口分组" allow-clear>
                    <a-option v-for="group in groupList" :key="group.id" :value="group.id">
                        {{ group.groupName }}
                    </a-option>
                </a-select>
            </a-form-item>
            <a-form-item field="apiDesc" label="接口描述">
                <a-textarea v-model="createApiForm.apiDesc" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { ref, inject, computed, reactive, getCurrentInstance, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/loading'
import { Modal } from '@arco-design/web-vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { useRouter, useRoute } from 'vue-router'
import {
    queryApiList,
    addApiList,
    ApiGroup,
    queryApiGroupList,
    ApiList,
    addApiGroup,
    updateApiGroup,
    deleteApiGroup
} from '@/api/apis'
import { Message } from '@arco-design/web-vue'
import ApiDoc from './components/api-doc.vue'
import ApiDesign from './components/api-design.vue'
import ApiRequest from './components/api-request.vue'
import ApiSqlParam from './components/api-sql-param.vue'

const baseURL = inject('baseURL')
const keyWord = ref('') // 搜索关键字
// 使用自定义的加载状态 Hook
const { loading, setLoading } = useLoading(true)

// 定义渲染数据的响应式变量
const renderData = ref<ApiGroup[]>([])
// 存储选中的 API ID
const selectedApiId = ref<number | null>(null)
// 选中的 API 对象
const selectedApi = ref<ApiList | null>(null)
// 获取数据的异步函数
const fetchData = async () => {
    setLoading(true) // 开始加载
    try {
        const { data } = await queryApiList(keyWord.value)
        renderData.value = data.records
    } catch (err) {
        // 错误处理，可以使用 errorHandler 或其他方式
    } finally {
        setLoading(false)
    }
}

const openApi = (api: ApiList) => {
    selectedApi.value = api
    selectedApiId.value = api.id
}

const handleCancel = () => {
    groupModalVisible.value = false
}

const handleBeforeOk = async (done: (closed: boolean) => void) => {
    const valid = await groupModalFormRef.value.validate()
    if (valid === undefined) {
        // 验证通过
        const params = {
            ...groupModalForm
        }
        setLoading(true) // 开始加载
        if (params.id !== undefined && params.id > 0) {
            // 编辑分组
            const { data } = await updateApiGroup(params)
            Message.success('分组信息更新成功')
            done(true)
            fetchData()
        } else {
            // 新增分组
            const { data } = await addApiGroup(params)
            Message.success('分组信息新增成功')
            done(true)
            fetchData()
        }
    } else {
        Message.error('表单验证失败')
        // 表单验证失败
        done(false) // 不关闭弹窗
    }
}

// 新增和编辑分组弹窗的状态
const groupModalVisible = ref(false)
const groupModalForm = reactive({
    id: 0,
    groupName: ''
})
const groupModalFormRef = ref<any>()

// 路由
const router = useRouter()
const route = useRoute()

const { t } = useI18n()

// 新增分组
const addGroup = () => {
    groupModalForm.id = 0
    groupModalForm.groupName = ''
    groupModalVisible.value = true
}

// 编辑分组
const editGroup = (group: ApiGroup) => {
    groupModalForm.id = group.id
    groupModalForm.groupName = group.groupName
    groupModalVisible.value = true
}

// 删除分组
const deleteGroup = async (group: ApiGroup) => {
    if (group.id !== undefined && group.id > 0) {
        Modal.warning({
            title: '删除确认',
            content: '删除不可恢复，确认删除分组吗？',
            okText: '确认',
            cancelText: '取消',
            hideCancel: false,
            onOk: async () => {
                const { data } = await deleteApiGroup(group)
                if (data) {
                    Message.success('分组删除成功')
                    fetchData()
                } else {
                    Message.error('分组删除失败')
                }
            },
            onCancel: () => {}
        })
    }
}

// 新增接口弹窗的状态
const createApiModalVisible = ref(false)
const createApiForm: ApiList = reactive({
    id: 0,
    apiName: '',
    apiPath: '',
    apiDesc: '',
    apiGroup: 1
})
const createApiFormRef = ref<any>()

const createHandleCancel = () => {
    createApiModalVisible.value = false
}

const createApi = () => {
    createApiForm.apiName = ''
    createApiForm.apiPath = ''
    createApiForm.apiDesc = ''
    createApiForm.apiGroup = 1
    createApiModalVisible.value = true
    fetchGroupList()
}

const craeteHandleBeforeOk = async (done: (closed: boolean) => void) => {
    const valid = await createApiFormRef.value.validate()
    if (valid === undefined) {
        // 验证通过
        const params: ApiList = {
            ...createApiForm
        }
        setLoading(true) // 开始加载
        const { data } = await addApiList(params)
        if (data) {
            Message.success('接口新增成功')
            done(true)
            fetchData()
        } else {
            Message.error('接口新增失败')
        }
    } else {
        Message.error('表单验证失败')
        // 表单验证失败
        done(false) // 不关闭弹窗
    }
}

const groupList = ref<ApiGroup[]>([])
const fetchGroupList = async () => {
    const { data } = await queryApiGroupList()
    groupList.value = data
    // 检查 createApiForm.apiGroup 是否在 groupList 中
    const isValidGroup = groupList.value.some(group => group.id === createApiForm.apiGroup)
    if (!isValidGroup && groupList.value.length > 0) {
        // 设置为第一个有效分组的 ID，避免因为id不同，在前端页面select下拉列表中多显示出无效值
        createApiForm.apiGroup = groupList.value[0].id
    }
}

// 通过 ref 引用子组件
const apiDoc = ref<InstanceType<typeof ApiDoc> | null>(null)
const apiDesign = ref<InstanceType<typeof ApiDesign> | null>(null)
const apiRequest = ref<InstanceType<typeof ApiRequest> | null>(null)
const apiSqlParam = ref<InstanceType<typeof ApiSqlParam> | null>(null)

const handleTabChange = (key: string | number) => {
    if (key === '1' && apiDoc.value) {
        apiDoc.value.init()
    } else if (key === '2' && apiDesign.value && apiSqlParam.value) {
        apiDesign.value.init()
        apiSqlParam.value.init()
    } else if (key === '3' && apiRequest.value) {
        apiRequest.value.init()
    }
}

onMounted(() => {
    nextTick(() => {
        fetchData()
    })
})
</script>

<script lang="ts">
export default {
    name: 'APIS'
}
</script>

<style scoped lang="less">
:deep(.arco-tabs-content) {
    padding-top: 0px;
}

.layout-demo {
    height: calc(100vh - 95px); // 设置高度为减去导航栏后的视口高度
    .api-tree {
        margin: 10px 0px;
    }
    .api-center {
        .api-header-left {
            margin-left: 15px;
            display: flex;
            align-items: center;

            span {
                margin: 12px 0px;
                font-size: 20px;
                font-weight: bold;
            }
        }
    }
}

.splitpanes__pane {
    height: calc(100vh - 95px); // 设置高度为减去导航栏后的视口高度
    font-family: Helvetica, Arial, sans-serif;
    font-size: 5em;
    background-color: #ffffff;
}

// .layout-demo :deep(.arco-layout) {
//     height: 100%; // 确保 layout 充满整个容器
// }

// .layout-demo :deep(.arco-layout-sider) {
//     width: 250px;
//     min-width: 250px;
//     max-width: 80%;
//     padding: 10px;
// }

// .layout-demo :deep(.arco-layout-content) {
//     background-color: #ffffff;
//     padding: 10px;
// }
:deep(.arco-collapse-item-content) {
    padding-right: 0px;
    padding-left: 0px;
    background-color: #ffffff;
}
// :deep(.arco-layout-sider-light) {
//     padding-right: 20px;
// }

.search-filter {
    display: flex;
    align-items: center;
    margin: 5px 0px;
}

.api-list {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    background-color: #f6f7f9;

    .api-list-item {
        display: flex;
        align-items: center; /* 垂直居中对齐 */
        justify-content: space-between; /* 左右对齐 */
        font-size: 13px;
        line-height: 13px;
        padding: 0px 5px;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
            background-color: #ffffff;
        }
    }
    .selected-item {
        color: #0054f9;
    }
    .left-content {
        display: flex;
        align-items: center; /* 使icon-code和文本垂直居中 */
    }

    .api-text {
        margin-left: 8px; /* 添加间距 */
    }

    .right-icon {
        margin-left: auto; /* 将右侧的icon-more按钮右对齐 */
    }
}
</style>
