<template>
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
                    <a-collapse-item header="公共数据" key="1">
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
                        <div class="api-list">
                            <div class="api-list-item">
                                <div class="left-content">
                                    <icon-code />
                                    <span class="api-text">接口数据dmadf</span>
                                </div>
                                <a-button type="text" class="right-icon">
                                    <icon-double-right />
                                </a-button>
                            </div>
                            <div class="api-list-item">
                                <div class="left-content">
                                    <icon-code />
                                    <span class="api-text">接口数据dmadf</span>
                                </div>
                                <a-button type="text" class="right-icon">
                                    <icon-double-right />
                                </a-button>
                            </div>
                            <div class="api-list-item">
                                <div class="left-content">
                                    <icon-code />
                                    <span class="api-text">接口数据dmadf</span>
                                </div>
                                <a-button type="text" class="right-icon">
                                    <icon-double-right />
                                </a-button>
                            </div>
                        </div>
                    </a-collapse-item>
                    <a-collapse-item header="财务数据" :key="2">
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
                        <div class="api-list">
                            <div class="api-list-item">
                                <div class="left-content">
                                    <icon-code />
                                    <span class="api-text">接口数据dmadf</span>
                                </div>
                                <a-button type="text" class="right-icon">
                                    <icon-double-right />
                                </a-button>
                            </div>
                            <div class="api-list-item">
                                <div class="left-content">
                                    <icon-code />
                                    <span class="api-text">接口数据dmadf</span>
                                </div>
                                <a-button type="text" class="right-icon">
                                    <icon-double-right />
                                </a-button>
                            </div>
                            <div class="api-list-item">
                                <div class="left-content">
                                    <icon-code />
                                    <span class="api-text">接口数据dmadf</span>
                                </div>
                                <a-button type="text" class="right-icon">
                                    <icon-double-right />
                                </a-button>
                            </div>
                        </div>
                    </a-collapse-item>
                    <a-collapse-item header="OA数据" key="3">
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
                        <div class="api-list">
                            <div class="api-list-item">
                                <div class="left-content">
                                    <icon-code />
                                    <span class="api-text">接口数据dmadf</span>
                                </div>
                                <a-button type="text" class="right-icon">
                                    <icon-double-right />
                                </a-button>
                            </div>
                            <div class="api-list-item">
                                <div class="left-content">
                                    <icon-code />
                                    <span class="api-text">接口数据dmadf</span>
                                </div>
                                <a-button type="text" class="right-icon">
                                    <icon-double-right />
                                </a-button>
                            </div>
                            <div class="api-list-item">
                                <div class="left-content">
                                    <icon-code />
                                    <span class="api-text">接口数据dmadf</span>
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
</template>

<script lang="ts" setup>
import { ref, computed, reactive, getCurrentInstance, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

function sayHello() {
    console.log('hello')
}
</script>

<script lang="ts">
export default {
    name: 'ApiTree'
}
</script>

<style scoped lang="less">
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
        padding: 8px 16px;
        padding: 5px;
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
