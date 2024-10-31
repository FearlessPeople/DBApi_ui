<template>
    <div class="api-design" v-if="api">
        <div class="api-header">
            <h2>{{ api.apiName }}</h2>
            <a-button type="outline">编辑</a-button>
        </div>

        <div class="api-design-center">
            <div class="api-design-left">api-design-left</div>
            <div class="api-design-center-content">api-design-center-content</div>
            <div class="api-design-right">api-design-right</div>
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

<style lang="less" scoped>
.api-design {
    padding: 0px 10px;

    .api-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .api-design-center {
        display: flex;

        .api-design-left,
        .api-design-center-content,
        .api-design-right {
            height: 100%;
        }

        .api-design-left {
            background-color: #967272;
            width: 15%;
        }

        .api-design-center-content {
            background-color: #729672;
            width: 70%;
        }

        .api-design-right {
            background-color: #727296;
            width: 15%;
        }
    }
}
</style>
