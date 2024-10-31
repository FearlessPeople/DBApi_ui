<template>
    <div class="api-doc">
        <div v-if="api">
            <h2>{{ api.apiName }}</h2>
            <p>接口路径: {{ api.apiPath }}</p>
            <p>
                发布时间: {{ api.publishTime }}&nbsp;&nbsp;创建时间: {{ api.createTime }}&nbsp;&nbsp;更新时间:
                {{ api.updateTime }}&nbsp;&nbsp;创建者: {{ api.createBy }}
            </p>
            <p>接口说明:</p>
            <p>{{ api.apiDesc }}</p>
        </div>
        <div v-else>
            <p>请选择一个 API 以查看详情</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, getCurrentInstance, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ApiList } from '@/api/apis'

// 接收父组件传递的 API 对象
const props = defineProps<{
    api: ApiList | null
}>()

const router = useRouter() // 获取路由实例
const route = useRoute() // 获取当前路由对象
</script>

<style scoped lang="less">
.api-doc {
    padding: 0px 10px;
}
</style>
