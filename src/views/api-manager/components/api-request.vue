<template>
    <div class="api-request" v-if="api">
        <div>
            <div class="api-request-url">
                <a-input :style="{ width: '100%' }" placeholder="" allow-clear>
                    <template #prepend>
                        <span style="color: rgb(var(--orange-6))">POST</span>
                    </template>
                </a-input>
                <a-button type="primary" status="warning">发送请求</a-button>
            </div>
            <div class="api-request-btn"></div>
        </div>
        <div class="api-request-params">
            <a-tabs default-active-key="1">
                <a-tab-pane key="1" title="参数"> SQL参数 </a-tab-pane>
                <a-tab-pane key="2" title="鉴权"> 鉴权</a-tab-pane>
                <a-tab-pane key="3" title="请求代码"> 请求代码</a-tab-pane>
            </a-tabs>
        </div>
        <div class="api-request-statu">状态:200 ok 时间:200ms 大小10B</div>
        <div class="api-request-result">
            <a-tabs default-active-key="1">
                <a-tab-pane key="1" title="JSON"> JSON </a-tab-pane>
            </a-tabs>
        </div>
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
.api-request {
    padding: 16px;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    .api-request-url {
        display: flex;
        flex: 1;
    }
}
</style>
