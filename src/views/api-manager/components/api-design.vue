<template>
    <div class="api-design" v-if="api">
        <div class="api-header">
            <div class="api-header-right">
                <p class="header-help">
                    <icon-info-circle />本项目只支持SELECT语句，请尽量编写标准SQL，如果不了解SQL语法，可参考
                    <a-link href="https://www.runoob.com/sql/sql-syntax.html" target="_blank">菜鸟教程</a-link>
                </p>
            </div>
        </div>

        <div class="api-design-center">
            <div class="api-design-left">
                <a-card title="数据源列表" style="height: 100%">
                    <template #extra> </template>
                    <a-select
                        v-model="dataSourceId"
                        placeholder="请选择一个数据源"
                        allow-clear
                        @change="handleDataSourceChange()"
                    >
                        <a-option v-for="db in allDataSourcesList" :key="db.id" :value="db.id">
                            {{ db.name }}
                        </a-option>
                    </a-select>
                    <a-tree :showLine="true" :data="treeData" :default-expanded-keys="['0']" />
                </a-card>
            </div>
            <div class="api-design-center-content">
                <a-card title="接口SQL编辑区">
                    <template #extra>
                        <div class="api-design-center-bottom">
                            <a-link @click="executeSql()">
                                <template #icon>
                                    <icon-caret-right style="color: rgb(var(--green-6))" />
                                </template>
                                运行
                            </a-link>
                            <a-link @click="saveSql()">
                                <template #icon>
                                    <icon-save style="color: rgb(var(--arcoblue-6))" />
                                </template>
                                保存
                            </a-link>
                        </div>
                    </template>
                    <Codemirror
                        v-model="code"
                        placeholder="请在这里输入SQL语句..."
                        :style="{ height: 'calc(100vh - 100px)' }"
                        :autofocus="true"
                        :indent-with-tab="true"
                        :tab-size="2"
                        :extensions="extensions"
                        @ready="handleReady"
                    />
                </a-card>
            </div>
            <div class="api-design-right">
                <ApiSqlParam :api="api" />
            </div>
        </div>
    </div>
    <div v-else>
        <h4>请选择一个 API 以查看详情</h4>
    </div>
    <div class="query-result-modal">
        <a-modal width="80%" :draggable="true" :footer="false" v-model:visible="resultVisible">
            <QueryResultTable
                v-if="queryResult"
                :columns="queryResult.columns"
                :data="queryResult.data"
                :totalCount="queryResult.count"
                :executionTime="queryResult.executionTime"
            />
            <template #title>
                <div>
                    <p v-if="queryResult">查询成功,总条数: {{ queryResult.count }} 耗时: {{ queryResult.executionTime }}</p>
                </div>
            </template>
        </a-modal>
    </div>
</template>
<script setup lang="ts">
import { ref, h, watch, reactive, shallowRef, getCurrentInstance, nextTick, onActivated, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { Message } from '@arco-design/web-vue'
import { Modal } from '@arco-design/web-vue'
import { IconStar, IconStorage } from '@arco-design/web-vue/es/icon'
import { allDbList, allTables, DataSourceRecord } from '@/api/sys-datasource'
import { ApiList, ApiSql, getApiSql, save, execute, QueryResult } from '@/api/apis'
import { sql } from '@codemirror/lang-sql'
import ApiSqlParam from './api-sql-param.vue'
import QueryResultTable from './query-result-table.vue'

// 接收父组件传递的 API 对象
const props = defineProps<{
    api: ApiList | null
}>()

const router = useRouter() // 获取路由实例
const route = useRoute() // 获取当前路由对象

const code = ref(`SELECT * FROM table_name`)
const extensions = [sql(), oneDark]

// Codemirror EditorView instance ref
const view = shallowRef()

const handleReady = (payload: { view: any }) => {
    view.value = payload.view
}

// Status is available at all times via Codemirror EditorView
const getCodemirrorStates = () => {
    if (!view.value) return
    const { state } = view.value
    const { ranges } = state.selection
}

// 定义树形节点的类型
interface TreeNode {
    title: string
    key: string
    children?: TreeNode[]
}

// 初始化树形数据
const treeData = reactive<TreeNode[]>([
    {
        title: '数据库表清单',
        key: '0',
        children: []
    }
])

const dataSourceId = ref(1)

// 获取数据源下的所有表
const fetchTableList = async () => {
    const res = await allTables(dataSourceId.value)
    treeData[0].children = res.data.map((table, index) => ({
        title: table,
        key: `0-${index}`,
        icon: () => h(IconStorage)
    }))
}

// 处理数据源切换
const handleDataSourceChange = async () => {
    fetchTableList()
}

// 初始化所有数据源列表
const allDataSourcesList = ref<DataSourceRecord[]>([])

// 获取所有数据库列表
const fetchAllDBList = async () => {
    const { data } = await allDbList()
    allDataSourcesList.value = data
    fetchTableList()
}

const reset = () => {
    code.value = `SELECT * FROM table_name`
    dataSourceId.value = 1
    fetchAllDBList()
}
const apisql = ref<ApiSql>()
// 初始化加载数据
const init = async () => {
    reset()
    // 检查 props.api 是否为 null
    if (props.api && props.api.id) {
        // 获取 API 详情
        const { data } = await getApiSql(props.api.id)
        if (data) {
            code.value = data.apiSql
            dataSourceId.value = data.datasourceId ?? 1 // 使用空值合并运算符提供默认值
            apisql.value = data
            fetchAllDBList()
        }
    }
}
const resultVisible = ref(false)
const queryResult = ref<QueryResult>()
const executeSql = async () => {
    // 获取当前codemirror编辑器的文本内容
    const sqlText = view.value.state.doc.toString()
    // 执行SQL语句
    const param = {
        apiId: props.api!.id,
        apiSql: sqlText,
        datasourceId: dataSourceId.value
    }
    const response = await execute(param)
    if (response.status) {
        Message.success(response.message)
        const data: QueryResult = response.data as QueryResult
        queryResult.value = data
        resultVisible.value = true
    } else {
        Modal.error({
            title: 'SQL执行失败',
            content: response.message
        })
    }
}

const saveSql = async () => {
    // 获取当前codemirror编辑器的文本内容
    const sqlText = view.value.state.doc.toString()
    // 执行SQL语句
    const param = {
        id: apisql.value?.id,
        apiId: props.api!.id,
        apiSql: sqlText,
        datasourceId: dataSourceId.value
    }
    const response = await save(param)
    if (response.status) {
        Message.success(response.message)
    } else {
        Message.error(response.message)
    }
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

<style lang="less" scoped>
.api-design {
    padding: 0px 10px;

    .api-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .api-header-left {
            display: flex;
            align-items: center;
        }
        .api-header-right {
            display: flex;
            align-items: center;
            .header-help {
                color: var(--color-neutral-6);
            }
        }
    }

    .api-design-center {
        display: flex;
        height: calc(100vh - 260px);

        .api-design-left,
        .api-design-center-content,
        .api-design-right {
            height: 100%;
            :deep(.arco-card-body) {
                padding: 0px;
            }
        }

        .api-design-left {
            width: 20%;
            // border: 1px solid var(--color-neutral-3);
        }

        .api-design-center-content {
            width: 65%;
            :deep(.arco-card-body) {
                padding: 0px;
            }
            .api-design-center-bottom {
                color: #999;
                height: 35px;
                line-height: 35px;
                padding-left: 10px;
            }
        }

        .api-design-right {
            width: 15%;
        }
    }
}
:deep(.arco-modal-body) {
    padding: 0px;
}
</style>
