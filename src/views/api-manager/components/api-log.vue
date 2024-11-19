<template>
    <div class="container" v-if="api">
        <a-card class="general-card" title="日志记录">
            <!-- 搜索表单 -->
            <a-row>
                <a-col :flex="1">
                    <a-form
                        :model="formModel"
                        :label-col-props="{ span: 6 }"
                        :wrapper-col-props="{ span: 18 }"
                        label-align="right"
                    >
                        <a-row :gutter="16">
                            <a-col :span="6">
                                <a-form-item field="responseStatus" label="响应状态">
                                    <a-select v-model="formModel.responseStatus" default-value="0">
                                        <a-option value="0">全部</a-option>
                                        <a-option value="200">成功200</a-option>
                                        <a-option value="400">请求失败400</a-option>
                                        <a-option value="500">服务器错误500</a-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item field="remark" label="时间">
                                    <a-range-picker
                                        style="width: 100%"
                                        show-time
                                        format="YYYY-MM-DD HH:mm:ss"
                                        v-model="formModel.createdTimeRange"
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </a-col>
                <a-col :flex="'86px'" style="text-align: right">
                    <a-space direction="vertical" :size="18">
                        <a-button type="primary" @click="search">
                            <template #icon>
                                <icon-search />
                            </template>
                            {{ $t('searchTable.form.search') }}
                        </a-button>
                    </a-space>
                </a-col>
            </a-row>
            <a-divider style="margin-top: 0" />

            <!-- 搜索结果表 -->
            <a-table
                row-key="id"
                column-resizable
                :loading="loading"
                :pagination="pagination"
                :data="renderData"
                :bordered="false"
                @page-change="onPageChange"
            >
                <template #columns>
                    <a-table-column title="#" data-index="id" :width="50" :max-width="50"></a-table-column>
                    <a-table-column title="API ID" data-index="apiId" :width="80" :max-width="80"></a-table-column>
                    <a-table-column title="API名称" data-index="apiName"></a-table-column>
                    <a-table-column title="API路径" data-index="apiPath"></a-table-column>
                    <a-table-column title="请求耗时" data-index="requestDuration" :width="100" :max-width="100"></a-table-column>
                    <a-table-column title="请求IP" data-index="clientIp"></a-table-column>
                    <a-table-column title="请求状态" data-index="responseStatus" :width="100" :max-width="100"></a-table-column>
                    <a-table-column title="请求参数" data-index="requestParams" :ellipsis="true" :tooltip="true"></a-table-column>
                    <a-table-column title="响应数据" data-index="responseData" :ellipsis="true" :tooltip="true"></a-table-column>
                    <a-table-column title="创建时间" data-index="createdTime"></a-table-column>
                </template>
            </a-table>
        </a-card>
    </div>
    <div class="no-api-doc" v-else>
        <p>请选择一个 API 以查看详情</p>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, inject, getCurrentInstance, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/loading'
import { ApiList, ApiRequestLog, ApiRequestLogParams, apiRequestLogList } from '@/api/apis'
import { Pagination } from '@/types/global'
import { Message } from '@arco-design/web-vue'
import { Dayjs } from 'dayjs'

const { proxy } = getCurrentInstance()!
const baseURL = inject('baseURL')

// 表单模型
const formModel = ref<ApiRequestLog>({
    id: 0,
    apiId: 0,
    responseStatus: undefined,
    createdTimeRange: [] // 初始化为空数组
})
// 使用自定义的加载状态 Hook
const { loading, setLoading } = useLoading(true)
// 国际化函数
const { t } = useI18n()
// 定义渲染数据的响应式变量
const renderData = ref<ApiRequestLog[]>([])

// 接收父组件传递的 API 对象
const props = defineProps<{
    api: ApiList | null
}>()

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
// 获取数据的异步函数
const fetchData = async (params: ApiRequestLogParams) => {
    // 如果日期范围有效，直接使用字符串数组
    if (formModel.value.createdTimeRange?.length === 2) {
        params.createdTimeRange = formModel.value.createdTimeRange // 直接传递字符串数组
    }

    if (props.api && props.api.id) {
        setLoading(true) // 开始加载
        try {
            params.id = undefined
            params.apiId = props.api.id // 设置 API ID
            const { data } = await apiRequestLogList(params) // 调用 API 获取数据
            renderData.value = data.records // 设置渲染数据
            pagination.current = params.current // 更新当前页
            pagination.total = data.total // 更新总条数
        } catch (err) {
            console.error('数据获取失败:', err) // 错误日志
        } finally {
            setLoading(false) // 加载结束
        }
    }
}

// 搜索触发函数
const search = () => {
    fetchData({
        current: basePagination.current,
        pageSize: basePagination.pageSize,
        ...formModel.value // 自动合并表单数据
    })
}
const init = () => {
    fetchData({
        ...basePagination,
        ...formModel.value
    } as unknown as ApiRequestLogParams)
}
// 分页变化时的处理函数
const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current })
}

// 使用 defineExpose 公开 init 方法
defineExpose({ init })

// 在组件挂载时获取数据
onMounted(() => {
    init()
})

// 监听 api 对象的变化并重新调用 init 方法
watch(
    () => props.api,
    (newApi, oldApi) => {
        if (newApi !== oldApi) {
            init()
        }
    }
)
</script>

<script lang="ts">
export default {
    name: 'DataSource'
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
.no-api-doc {
    p {
        color: #888;
        text-align: center;
        margin-top: 20px;
        font-size: 15px;
    }
}
</style>
