<template>
    <div class="api-sql-param" v-if="api">
        <div class="param-list">
            <div
                class="param-item"
                v-for="(item, index) in items"
                :key="index"
                @mouseover="showButtons(index)"
                @mouseout="hideButtons()"
            >
                <a-tooltip :content="item.content">
                    <div class="param-item-label">
                        {{ item.label }}
                    </div>
                </a-tooltip>
                <div class="param-item-operation" v-if="showButtonsIndex === index">
                    <a-button type="dashed" size="mini" shape="round" status="warning"><icon-edit /></a-button>
                    <a-button type="dashed" size="mini" shape="round" status="danger"><icon-delete /></a-button>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <h4>请选择一个 API 以查看详情</h4>
    </div>
</template>

<script setup lang="ts">
import { ref, h, watch, reactive, shallowRef, getCurrentInstance, nextTick, onActivated, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { Message } from '@arco-design/web-vue'
import { IconStar, IconStorage } from '@arco-design/web-vue/es/icon'
import { allDbList, allTables, DataSourceRecord } from '@/api/sys-datasource'
import { ApiList, getApiSql } from '@/api/apis'
import { sql } from '@codemirror/lang-sql'

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

// 初始化加载数据
const init = async () => {
    reset()
    // 检查 props.api 是否为 null
    if (props.api && props.api.id) {
        // 获取 API 详情
        const { data } = await getApiSql(props.api.id)
        if (data) {
            code.value = data.apiSql
            dataSourceId.value = data.datasourceId
            // 获取所有数据库列表
            fetchAllDBList()
        }
    }
}

const executeSql = async () => {
    // 获取当前codemirror编辑器的文本内容
    const sqlText = view.value.state.doc.toString()
    // 执行SQL语句
    // const res = await getApiSql(props.api!.id, { apiSql: sqlText, datasourceId: dataSourceId.value })
    Message.success(sqlText)
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

// 新增状态变量和方法
const showButtonsIndex = ref(-1)

const showButtons = (index: number) => {
    showButtonsIndex.value = index
}

const hideButtons = () => {
    showButtonsIndex.value = -1
}

// 示例数据
const items = [
    { label: 'brand_code', content: 'brand_code' },
    { label: 'brand_code222222222222', content: 'brand_code222222222222' }
]
</script>

<style lang="less" scoped>
.api-sql-param {
    padding: 0px 0px;
    .param-list {
        display: flex;
        flex-direction: column;
        .param-item {
            display: flex;
            flex-direction: row; /* 水平布局 */
            align-items: center; /* 垂直居中 */
            padding: 10px 10px;
            border-bottom: 1px solid #e8e8e8;

            .param-item-label {
                padding-left: 10px;
                font-weight: bold;
                overflow: hidden;
                width: 50%;
                // 设置超出显示省略号
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .param-item-operation {
                margin-left: auto; /* 将操作按钮推到最右边 */
                display: flex;
                gap: 8px; /* 按钮间距 */
                text-align: left; /* 确保按钮内容左对齐 */
            }
        }
    }
}
</style>
