<template>
    <div class="layout-demo">
        <a-layout>
            <a-layout-sider :resize-directions="['right']">
                <ApiTree></ApiTree>
            </a-layout-sider>
            <a-layout-content>
                <ApiDetail></ApiDetail>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, getCurrentInstance, nextTick, onMounted } from 'vue'
import ApiTree from './components/api-tree.vue'
import ApiDetail from './components/api-detail.vue'
</script>

<script lang="ts">
export default {
    name: 'APIS'
}
</script>

<style scoped lang="less">
.layout-demo {
    height: calc(100vh - 95px); // 设置高度为减去导航栏后的视口高度
}

.layout-demo :deep(.arco-layout) {
    height: 100%; // 确保 layout 充满整个容器
}

.layout-demo :deep(.arco-layout-sider) {
    width: 300px;
    min-width: 300px;
    max-width: 80%;
    padding: 10px;
}

.layout-demo :deep(.arco-layout-content) {
    background-color: #ffffff;
    padding: 10px;
}
</style>
