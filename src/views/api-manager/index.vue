<template>
    <div class="layout-demo">
        <a-layout>
            <a-layout-sider :resize-directions="['right']">
                <div class="api-tree">
                    <div>
                        <div class="search-filter">
                            <a-input-search v-model="searchKey" placeholder="搜索接口" />
                            <a-button type="text">
                                <template #icon>
                                    <icon-refresh />
                                </template>
                            </a-button>
                            <a-button type="text">
                                <template #icon>
                                    <icon-plus />
                                </template>
                            </a-button>
                        </div>
                        <div class="search-content">
                            <a-collapse :bordered="false">
                                <a-collapse-item v-for="group in renderData" :key="group.id" :header="group.groupName">
                                    <template #extra>
                                        <a-dropdown trigger="hover">
                                            <a-button type="text">
                                                <icon-more />
                                            </a-button>
                                            <template #content>
                                                <a-doption>新增接口</a-doption>
                                                <a-doption>编辑分组</a-doption>
                                                <a-doption>删除分组</a-doption>
                                            </template>
                                        </a-dropdown>
                                    </template>

                                    <!-- 接口列表 -->
                                    <div class="api-list">
                                        <div
                                            v-for="api in group.apiList"
                                            :key="api.id"
                                            @click="openApi(api)"
                                            class="api-list-item"
                                        >
                                            <div class="left-content">
                                                <icon-code />
                                                <span class="api-text">{{ api.apiName }}</span>
                                            </div>
                                            <a-button type="text" class="right-icon">
                                                <icon-double-right />
                                            </a-button>
                                        </div>
                                    </div>
                                </a-collapse-item>
                            </a-collapse>
                        </div>
                    </div>
                </div>
            </a-layout-sider>
            <a-layout-content>
                <!-- 向 ApiDetail 组件传递 api 对象 -->
                <ApiDetail :api="selectedApi" />
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, getCurrentInstance, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/loading'
import { useRouter, useRoute } from 'vue-router'
import { queryApiList, ApiGroup, ApiList } from '@/api/apis'
import ApiDetail from './components/api-detail.vue'

const searchKey = ref('') // 搜索关键字
// 使用自定义的加载状态 Hook
const { loading, setLoading } = useLoading(true)

// 定义渲染数据的响应式变量
const renderData = ref<ApiGroup[]>([])

const selectedApi = ref<ApiList | null>(null) // 选中的 API 对象
// 获取数据的异步函数
const fetchData = async () => {
    setLoading(true) // 开始加载
    try {
        const { data } = await queryApiList()
        renderData.value = data.records
    } catch (err) {
        // 错误处理，可以使用 errorHandler 或其他方式
    } finally {
        setLoading(false)
    }
}

const openApi = (api: ApiList) => {
    selectedApi.value = api // 将选中的 API 对象存储到响应式变量中
}

onMounted(() => {
    fetchData()
})
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

.search-filter {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
:deep(.arco-collapse-item-content) {
    width: 100%;
    padding-right: 0px;
    padding-left: 0px;
    background-color: #ffffff;
}
.api-list {
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    .api-list-item {
        display: flex;
        align-items: center; /* 垂直居中对齐 */
        justify-content: space-between; /* 左右对齐 */
        font-size: 13px;
        line-height: 13px;
        padding: 0px 5px;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
            background-color: #f6f7f9;
        }
    }

    .left-content {
        display: flex;
        align-items: center; /* 使icon-code和文本垂直居中 */
    }

    .api-text {
        margin-left: 8px; /* 添加间距 */
    }

    .right-icon {
        margin-left: auto; /* 将右侧的icon-more按钮右对齐 */
    }
}
</style>
