<template>
    <div class="api-log" v-if="api">
        <div class="container">
            <a-card class="general-card" title="访问日志列表">
                <a-row>
                    <a-col :flex="1">
                        <a-form
                            :model="formModel"
                            :label-col-props="{ span: 6 }"
                            :wrapper-col-props="{ span: 18 }"
                            label-align="right"
                        >
                            <a-row :gutter="16">
                                <!-- <a-col :span="6">
                                    <a-form-item field="number" label="API ID">
                                        <a-input v-model="formModel.number" placeholder="请输入API接口ID" />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="6">
                                    <a-form-item field="name" label="API路径">
                                        <a-input v-model="formModel.name" placeholder="请输入API接口路径" />
                                    </a-form-item>
                                </a-col> -->
                                <a-col :span="6">
                                    <a-form-item field="contentType" label="状态">
                                        <a-select
                                            v-model="formModel.contentType"
                                            :options="contentTypeOptions"
                                            placeholder="全部"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="6">
                                    <a-form-item field="createdTime" label="时间">
                                        <a-range-picker v-model="formModel.createdTime" style="width: 100%" />
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
                <a-table
                    row-key="id"
                    :loading="loading"
                    :pagination="pagination"
                    :columns="(cloneColumns as TableColumnData[])"
                    :data="renderData"
                    :bordered="false"
                    :size="size"
                    @page-change="onPageChange"
                >
                    <template #index="{ rowIndex }">
                        {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
                    </template>
                    <template #contentType="{ record }">
                        <a-space>
                            <a-avatar v-if="record.contentType === 'img'" :size="16" shape="square">
                                <img
                                    alt="avatar"
                                    src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/581b17753093199839f2e327e726b157.svg~tplv-49unhts6dw-image.image"
                                />
                            </a-avatar>
                            <a-avatar v-else-if="record.contentType === 'horizontalVideo'" :size="16" shape="square">
                                <img
                                    alt="avatar"
                                    src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77721e365eb2ab786c889682cbc721c1.svg~tplv-49unhts6dw-image.image"
                                />
                            </a-avatar>
                            <a-avatar v-else :size="16" shape="square">
                                <img
                                    alt="avatar"
                                    src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/ea8b09190046da0ea7e070d83c5d1731.svg~tplv-49unhts6dw-image.image"
                                />
                            </a-avatar>
                            {{ $t(`searchTable.form.contentType.${record.contentType}`) }}
                        </a-space>
                    </template>
                    <template #filterType="{ record }">
                        {{ $t(`searchTable.form.filterType.${record.filterType}`) }}
                    </template>
                    <template #status="{ record }">
                        <span v-if="record.status === 'offline'" class="circle"></span>
                        <span v-else class="circle pass"></span>
                        {{ $t(`searchTable.form.status.${record.status}`) }}
                    </template>
                    <template #operations>
                        <a-button v-permission="['admin']" type="text" size="small">
                            {{ $t('searchTable.columns.operations.view') }}
                        </a-button>
                    </template>
                </a-table>
            </a-card>
        </div>
    </div>
    <div class="no-api-doc" v-else>
        <p>请选择一个 API 以查看详情</p>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, getCurrentInstance, nextTick, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/loading'
import { Pagination } from '@/types/global'
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface'
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface'
import cloneDeep from 'lodash/cloneDeep'
import Sortable from 'sortablejs'
import { useRouter, useRoute } from 'vue-router'
import { ApiList, ApiRequestLog, apiRequestLogList, ApiRequestLogParams } from '@/api/apis'

type SizeProps = 'mini' | 'small' | 'medium' | 'large'
type Column = TableColumnData & { checked?: true }

const generateFormModel = () => {
    return {
        number: '',
        name: '',
        contentType: '',
        filterType: '',
        createdTime: [],
        status: ''
    }
}
const { loading, setLoading } = useLoading(true)
const { t } = useI18n()
const renderData = ref<ApiRequestLog[]>([])
const formModel = ref(generateFormModel())
const cloneColumns = ref<Column[]>([])
const showColumns = ref<Column[]>([])

const size = ref<SizeProps>('medium')

const basePagination: Pagination = {
    current: 1,
    pageSize: 20
}
const pagination = reactive({
    ...basePagination
})
const columns = computed<TableColumnData[]>(() => [
    {
        title: t('searchTable.columns.index'),
        dataIndex: 'index',
        slotName: 'index'
    },
    {
        title: t('searchTable.columns.number'),
        dataIndex: 'number'
    },
    {
        title: t('searchTable.columns.name'),
        dataIndex: 'name'
    },
    {
        title: t('searchTable.columns.contentType'),
        dataIndex: 'contentType',
        slotName: 'contentType'
    },
    {
        title: t('searchTable.columns.filterType'),
        dataIndex: 'filterType'
    },
    {
        title: t('searchTable.columns.count'),
        dataIndex: 'count'
    },
    {
        title: t('searchTable.columns.createdTime'),
        dataIndex: 'createdTime'
    },
    {
        title: t('searchTable.columns.status'),
        dataIndex: 'status',
        slotName: 'status'
    },
    {
        title: t('searchTable.columns.operations'),
        dataIndex: 'operations',
        slotName: 'operations'
    }
])
const contentTypeOptions = computed<SelectOptionData[]>(() => [
    {
        label: '全部',
        value: ''
    },
    {
        label: '成功',
        value: '200'
    },
    {
        label: '失败',
        value: '500'
    }
])

const fetchData = async (params: ApiRequestLogParams = { current: 1, pageSize: 20 }) => {
    setLoading(true)
    try {
        const { data } = await apiRequestLogList(params)
        renderData.value = data.records // 设置渲染数据
        pagination.current = params.current // 更新当前页
        pagination.total = data.total // 更新总条数
    } catch (err) {
        // you can report use errorHandler or other
    } finally {
        setLoading(false)
    }
}

const search = () => {
    fetchData({
        ...basePagination,
        ...formModel.value
    } as unknown as ApiRequestLogParams)
}
const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current })
}

fetchData()

watch(
    () => columns.value,
    val => {
        cloneColumns.value = cloneDeep(val)
        cloneColumns.value.forEach((item, index) => {
            item.checked = true
        })
        showColumns.value = cloneDeep(cloneColumns.value)
    },
    { deep: true, immediate: true }
)

// 接收父组件传递的 API 对象
const props = defineProps<{
    api: ApiList | null
}>()

const init = () => {
    console.log('ApiDoc 初始化')
    // 其他初始化逻辑
}
// 使用 defineExpose 公开 init 方法
defineExpose({ init })
</script>

<style scoped lang="less">
.api-log {
    padding: 16px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    color: #333;

    p {
        margin: 8px 0;
        font-size: 14px;
        line-height: 1.6;

        &:first-of-type {
            font-weight: bold;
            font-size: 16px;
        }
    }

    .highlight {
        color: #1a73e8;
        font-weight: bold;
    }

    .timestamp {
        font-size: 12px;
        color: #666;
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
