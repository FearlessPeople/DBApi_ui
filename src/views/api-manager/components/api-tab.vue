<template>
    <a-tabs trigger="hover">
        <template #extra>
            <a-button type="primary">新建接口</a-button>&nbsp;&nbsp;
            <a-button size="mini" type="outline" status="success">帮助文档</a-button>
        </template>
        <a-tab-pane key="1" title="文档"> <ApiDoc :api="api"></ApiDoc> </a-tab-pane>
        <a-tab-pane key="2" title="接口设计"> Content of Tab Panel 2 </a-tab-pane>
        <a-tab-pane key="3" title="运行"> Content of Tab Panel 3 </a-tab-pane>
        <a-tab-pane key="4" title="访问日志"> Content of Tab Panel 4 </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts" setup>
// 首先导入所有来自 'vue' 的模块
import { ref, computed, reactive, getCurrentInstance, nextTick, onMounted, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'

// 然后导入其他模块
import useLoading from '@/hooks/loading'
import { queryApiList, ApiGroup, ApiList } from '@/api/apis'
import ApiDoc from './api-doc.vue'

// 定义响应式引用和props
const currApi = ref<ApiList | null>(null) // 选中的 API 对象
const props = defineProps<{
    api: ApiList | null // 接收父组件传递的 API 对象
}>()
</script>

<script lang="ts">
export default {
    name: 'ApiTab'
}
</script>

<style lang="scss" scoped></style>
