<template>
    <div class="query-result">
        <a-table v-if="data.length > 0" :columns="columnsWithKey" :data="data" :pagination="false"> </a-table>
        <p v-else>No data available</p>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'

// 接收父组件传递的数据
const props = defineProps<{
    columns: string[]
    data: Record<string, any>[]
    totalCount: number
    executionTime: number
}>()

// 动态生成带有 key 的列数据，Arco 的 Table 需要 columns 配置
const columnsWithKey = computed(() => {
    return props.columns.map(column => ({
        title: column,
        key: column,
        dataIndex: column
    }))
})

// 解构获取其他 props
const { totalCount, executionTime, data } = props
</script>

<style scoped>
.query-result {
    margin: 3px;
}

.summary {
    margin-bottom: 10px;
    font-size: 16px;
}

p {
    font-size: 14px;
    color: #666;
}

a-table {
    margin-top: 10px;
}
</style>
