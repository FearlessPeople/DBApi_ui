<template>
    <div class="api-doc" v-if="api">
        <p>接口ID: {{ api.id }}</p>
        <p>
            接口路径: <a-tag bordered color="orangered">{{ api.apiPath }}</a-tag>
        </p>
        <p>
            发布时间: {{ api.publishTime }}&nbsp;&nbsp;创建时间: {{ api.createTime }}&nbsp;&nbsp;更新时间:
            {{ api.updateTime }}&nbsp;&nbsp;创建者: {{ api.createBy }}
        </p>
        <p>接口说明:</p>
        <p>{{ api.apiDesc }}</p>
    </div>
    <div v-else>
        <h4>请选择一个 API 以查看详情</h4>
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

const init = () => {
    console.log('ApiDoc 初始化')
    // 其他初始化逻辑
}
// 使用 defineExpose 公开 init 方法
defineExpose({ init })
</script>

<style scoped lang="less">
.api-doc {
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

h4 {
    color: #888;
    text-align: center;
    margin-top: 20px;
}
</style>
