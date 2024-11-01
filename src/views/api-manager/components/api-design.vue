<template>
    <div class="api-design" v-if="api">
        <div class="api-header">
            <div class="api-header-left">
                <h2>{{ api.apiName }}</h2>
                <span>{{ api.apiDesc }}</span>
            </div>
            <div class="api-header-right">
                <p class="header-help">
                    <icon-info-circle />本项目只支持SELECT语句，请尽量编写标准SQL，如果不了解SQL语法，可参考
                    <a-link href="https://www.runoob.com/sql/sql-syntax.html" target="_blank">菜鸟教程</a-link>
                </p>
            </div>
        </div>

        <div class="api-design-center">
            <div class="api-design-left">
                <a-card title="数据源列表" style="height: 100%">
                    <template #extra>
                        <a-link>More</a-link>
                    </template>
                    <a-select placeholder="请选择一个数据源 ...">
                        <a-option>Beijing</a-option>
                        <a-option>Shanghai</a-option>
                        <a-option>Guangzhou</a-option>
                        <a-option disabled>Disabled</a-option>
                    </a-select>
                    <a-tree :data="treeData" :default-expanded-keys="['0-0-0']" :default-selected-keys="['0-0-0', '0-0-1']" />
                </a-card>
            </div>
            <div class="api-design-center-content">
                <a-card title="接口SQL编辑区">
                    <template #extra>
                        <div class="api-design-center-bottom">
                            <a-link href="link">
                                <template #icon>
                                    <icon-caret-right style="color: rgb(var(--green-6))" />
                                </template>
                                运行
                            </a-link>
                            <a-link href="link">
                                <template #icon>
                                    <icon-save style="color: rgb(var(--arcoblue-6))" />
                                </template>
                                保存
                            </a-link>
                            <a-link href="link">
                                <template #icon>
                                    <icon-eye />
                                </template>
                                查看执行结果</a-link
                            >
                            <span>成功 查询耗时2.3秒</span>
                        </div>
                    </template>
                    <Codemirror
                        v-model="code"
                        placeholder="请在这里输入SQL语句..."
                        :style="{ height: 'calc(100vh - 240px)' }"
                        :autofocus="true"
                        :indent-with-tab="true"
                        :tab-size="2"
                        :extensions="extensions"
                        @ready="handleReady"
                    />
                </a-card>
            </div>
            <div class="api-design-right">
                <a-card title="接口参数" style="height: 100%; padding: 0px">
                    <template #extra>
                        <a-link>新建</a-link>
                    </template>
                    <a-select placeholder="请选择一个数据源 ...">
                        <a-option>Beijing</a-option>
                        <a-option>Shanghai</a-option>
                        <a-option>Guangzhou</a-option>
                        <a-option disabled>Disabled</a-option>
                    </a-select>
                    <a-tree :data="treeData" :default-expanded-keys="['0-0-0']" :default-selected-keys="['0-0-0', '0-0-1']" />
                </a-card>
            </div>
        </div>
    </div>
    <div v-else>
        <h4>请选择一个 API 以查看详情</h4>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, shallowRef, getCurrentInstance, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'

import { ApiList } from '@/api/apis'
import { sql } from '@codemirror/lang-sql'

// 接收父组件传递的 API 对象
const props = defineProps<{
    api: ApiList | null
}>()

const router = useRouter() // 获取路由实例
const route = useRoute() // 获取当前路由对象

const code = ref(
    `select * from ods.ods_local_cw_clinic_zxp t where 1=1 and batch_no = '20240920133320428691' and brand_code ='AA0292';`
)
const extensions = [sql(), oneDark]

// Codemirror EditorView instance ref
const view = shallowRef()

const handleReady = (payload: { view: any }) => {
    view.value = payload.view
}

// Status is available at all times via Codemirror EditorView
const getCodemirrorStates = () => {
    if (!view.value) return
    const { state } = view.value
    const { ranges } = state.selection
}

const treeData = [
    {
        title: 'Trunk 0-0',
        key: '0-0',
        children: [
            {
                title: 'Branch 0-0-0',
                key: '0-0-0',
                disabled: true,
                children: [
                    {
                        title: 'Leaf',
                        key: '0-0-0-0'
                    },
                    {
                        title: 'Leaf',
                        key: '0-0-0-1'
                    }
                ]
            },
            {
                title: 'Branch 0-0-1',
                key: '0-0-1',
                children: [
                    {
                        title: 'Leaf',
                        key: '0-0-1-0'
                    }
                ]
            }
        ]
    }
]
</script>

<style lang="less" scoped>
.api-design {
    padding: 0px 10px;

    .api-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .api-header-left {
            display: flex;
            align-items: center;
            span {
                margin-left: 20px;
            }
        }
        .api-header-right {
            display: flex;
            align-items: center;
            .header-help {
                color: var(--color-neutral-6);
            }
        }
    }

    .api-design-center {
        display: flex;
        height: calc(100vh - 205px);

        .api-design-left,
        .api-design-center-content,
        .api-design-right {
            height: 100%;
        }

        .api-design-left {
            width: 15%;
            // border: 1px solid var(--color-neutral-3);
        }

        .api-design-center-content {
            width: 70%;
            :deep(.arco-card-body) {
                padding: 0px;
            }
            .api-design-center-bottom {
                color: #999;
                height: 35px;
                line-height: 35px;
                padding-left: 10px;
            }
        }

        .api-design-right {
            width: 15%;
        }
    }
}
</style>
