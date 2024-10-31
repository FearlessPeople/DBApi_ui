<template>
    <div class="api-design">
        <div v-if="api">
            <h1>{{ api.apiName }}</h1>
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

<style lang="scss" scoped></style>
