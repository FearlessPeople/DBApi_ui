<template>
    <h2>API 详情</h2>
    <div v-if="api">
        <p>API 名称: {{ api.apiName }}</p>
        <p>API 描述: {{ api.apiDesc }}</p>
        <!-- 其他 API 详细信息 -->
    </div>
    <div v-else>
        <p>请选择一个 API 以查看详情</p>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, getCurrentInstance, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/loading'
import { useRouter, useRoute } from 'vue-router'

import { queryApiList, ApiGroup, ApiList } from '@/api/apis'

import { defineProps } from 'vue'

const props = defineProps<{
    api: ApiList | null // 接收父组件传递的 API 对象
}>()
</script>

<script lang="ts">
export default {
    name: 'ApiDetail'
}
</script>

<style lang="scss" scoped></style>
