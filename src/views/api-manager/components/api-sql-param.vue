<template>
    <a-card title="SQL参数" style="height: 100%; padding: 0px">
        <template #extra>
            <a-tooltip content="点击刷新SQL参数">
                <a-link @click="init()"><icon-refresh /></a-link>
            </a-tooltip>
            <a-tooltip content="点击新建SQL参数">
                <a-link @click="createParam()"><icon-plus /></a-link>
            </a-tooltip>
        </template>

        <div class="api-sql-param" v-if="api">
            <div class="param-list">
                <div class="param-item" v-for="(item, index) in paramList" :key="index">
                    <!-- 判断如果item有值才显示如下内容 -->
                    <div class="param-item-icon">
                        <svg
                            t="1731400046190"
                            class="icon"
                            viewBox="0 0 2340 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="3579"
                            width="20"
                            height="20"
                            v-if="item.paramType === 1"
                        >
                            <path
                                d="M320.512 148.626286L0 987.136h146.724571l76.361143-210.212571h351.085715l76.361142 210.212571h146.870858L476.745143 148.626286H320.512zM264.192 664.137143l132.681143-367.469714h4.681143l131.657143 367.469714H264.045714zM812.470857 148.626286v838.509714h385.170286c89.234286 0 159.597714-16.384 209.042286-49.298286 57.490286-39.936 86.893714-102.253714 86.893714-186.806857 0-56.32-14.189714-102.107429-41.106286-135.021714-28.233143-34.084571-69.339429-56.32-124.489143-66.852572 42.276571-16.530286 74.020571-38.765714 96.256-69.339428 22.381714-32.914286 34.084571-72.850286 34.084572-119.808 0-63.341714-22.381714-113.810286-65.828572-151.405714-46.811429-39.936-112.64-59.977143-196.022857-59.977143H812.470857z m137.362286 112.786285h212.553143c56.32 0 96.256 9.362286 122.148571 28.233143 23.405714 17.554286 36.425143 46.811429 36.425143 86.893715 0 43.446857-13.019429 75.044571-36.571429 95.085714-24.576 18.724571-65.682286 29.257143-124.342857 29.257143H949.833143V261.558857z m0 352.256h231.277714c61.147429 0 105.764571 10.532571 133.997714 31.744 26.916571 21.065143 40.96 55.149714 40.96 103.277715 0 46.957714-18.724571 79.872-56.32 100.937143-29.257143 16.530286-70.363429 24.868571-122.148571 24.868571H949.833143V613.522286zM1919.561143 132.242286c-133.851429 0-235.958857 43.446857-306.468572 132.681143-62.171429 77.531429-92.745143 179.638857-92.745142 304.274285 0 126.683429 29.257143 227.620571 89.234285 302.811429 68.169143 86.893714 172.617143 131.657143 312.466286 131.657143 90.404571 0 167.789714-25.892571 232.448-77.531429 69.339429-55.296 112.64-131.657143 131.510857-230.253714h-133.851428c-16.530286 63.488-44.617143 111.616-84.553143 143.36-37.595429 28.086857-86.893714 43.300571-146.870857 43.300571-91.574857 0-159.597714-29.257143-203.044572-85.723428-39.936-52.662857-59.977143-129.170286-59.977143-227.766857 0-96.256 20.041143-171.446857 61.147429-225.426286 44.617143-61.001143 110.299429-90.404571 198.363428-90.404572 58.806857 0 106.788571 11.702857 144.530286 37.595429 38.765714 25.746286 64.512 65.828571 78.701714 120.978286h133.851429c-13.019429-84.553143-49.298286-152.722286-110.445714-202.020572-63.341714-51.638857-145.554286-77.531429-244.297143-77.531428z"
                                fill="#22ACE3"
                                p-id="3580"
                            ></path>
                        </svg>
                        <svg
                            v-if="item.paramType === 2"
                            t="1731401062758"
                            class="icon"
                            viewBox="0 0 1088 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="3254"
                            width="20"
                            height="20"
                        >
                            <path d="M64 0h1024v1024H64z" fill="#00a2dc" fill-opacity="0" p-id="3255"></path>
                            <path
                                d="M170.24 704h94.08V259.84H194.56l-133.12 26.88V364.8l108.8-21.12zM410.24 704h310.4V627.2H526.72v-5.12l28.16-22.4c129.92-102.4 155.52-148.48 155.52-220.16 0-85.12-57.6-126.08-155.52-126.08-42.88 0-83.84 5.12-117.76 16v77.44c38.4-12.16 71.04-16.64 99.84-16.64 48.64 0 77.44 14.72 77.44 63.36 0 50.56-48 101.76-204.16 227.2V704zM899.2 710.4c124.8 0 187.52-40.96 187.52-131.2 0-54.4-28.16-94.08-82.56-104.96v-3.84c49.28-16 71.04-48.64 71.04-95.36 0-90.88-62.08-121.6-161.92-121.6-36.48 0-77.44 6.4-97.92 13.44v74.88c24.96-7.68 58.88-12.8 86.4-12.8 49.28 0 80.64 11.52 80.64 51.84 0 45.44-39.68 58.88-101.76 58.88h-33.28v71.04h33.92c68.48 0 108.8 12.8 108.8 60.8 0 50.56-42.88 62.08-96 62.08-33.92 0-62.08-3.84-95.36-10.88v79.36c27.52 5.76 61.44 8.32 100.48 8.32z"
                                fill="#00a2dc"
                                p-id="3256"
                            ></path>
                        </svg>
                        <svg
                            v-if="item.paramType === 3"
                            t="1731401107729"
                            class="icon"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="4745"
                            width="18"
                            height="18"
                        >
                            <path
                                d="M465.492945 631.46614h79.786601a39.423967 39.423967 0 1 0 0-78.762601h-79.786601a39.423967 39.423967 0 1 0 0 78.762601z m0 157.525203h79.786601a39.423967 39.423967 0 1 0 0-78.762602h-79.786601a39.423967 39.423967 0 1 0 0 78.762602zM864.425946 78.506601H704.852746V39.082634a39.935967 39.935967 0 0 0-79.7866 0V78.506601h-226.133145V39.082634a39.935967 39.935967 0 0 0-79.7866 0V78.506601H159.5732A159.061201 159.061201 0 0 0 0 236.287803v630.186142A159.061201 159.061201 0 0 0 159.5732 1023.999147h704.852746A159.061201 159.061201 0 0 0 1023.999147 866.473945V236.287803A159.061201 159.061201 0 0 0 864.425946 78.762601z m79.7866 787.711344a79.5306 79.5306 0 0 1-79.7866 78.762601H159.5732a79.5306 79.5306 0 0 1-79.7866-78.762601V393.642339h864.425946z m0-551.423541H79.7866v-78.762601a79.5306 79.5306 0 0 1 79.7866-78.762601h159.573201v39.423967a39.935967 39.935967 0 0 0 79.7866 0v-39.423967h226.047812v39.423967a39.935967 39.935967 0 0 0 79.7866 0v-39.423967h159.5732a79.5306 79.5306 0 0 1 79.7866 78.762601zM226.047812 788.906009h79.7866a39.423967 39.423967 0 1 0 0-78.762601h-79.7866a39.423967 39.423967 0 1 0 0 78.762601z m478.719601-157.525202h79.7866a39.423967 39.423967 0 1 0 0-78.762601H704.852746a39.423967 39.423967 0 1 0 0 78.762601z m-478.719601 0h79.7866a39.423967 39.423967 0 1 0 0-78.762601h-79.7866a39.423967 39.423967 0 1 0 0 78.762601z m478.719601 157.525202h79.7866a39.423967 39.423967 0 1 0 0-78.762601H704.852746a39.423967 39.423967 0 1 0 0 78.762601z"
                                fill="#00a2dc"
                                p-id="4746"
                            ></path>
                        </svg>
                        <svg
                            v-if="item.paramType === 4"
                            t="1731401238166"
                            class="icon"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="6448"
                            width="20"
                            height="20"
                        >
                            <path
                                d="M140.16 810.24c24.32 0 46.08-4.8 65.28-14.336 19.264-9.6 35.456-23.04 48.704-40.384 13.248-17.344 23.296-38.208 30.144-62.528 6.912-24.32 10.304-51.52 10.304-81.6 0-44.48-7.808-80.64-23.488-108.352-15.744-27.648-40.512-49.792-74.368-66.368a486.208 486.208 0 0 0-25.6-11.648 118.848 118.848 0 0 1-23.296-12.8 62.016 62.016 0 0 1-16.64-17.536 47.36 47.36 0 0 1-6.4-25.6c0-15.04 4.288-27.2 12.736-36.48a42.24 42.24 0 0 1 32.768-14.016c10.56 0 21.504 3.2 32.832 9.728 11.264 6.464 22.528 16.448 33.792 29.888l41.28-118.848a230.208 230.208 0 0 0-61.888-35.328A176.832 176.832 0 0 0 154.432 192c-21.12 0-40.32 4.672-57.344 13.952a126.72 126.72 0 0 0-43.392 39.232 195.2 195.2 0 0 0-27.52 60.608A295.296 295.296 0 0 0 16.384 384.64c0 28.992 3.072 52.928 9.28 71.808 6.144 18.944 14.272 34.56 24.32 47.04 10.048 12.416 21.504 22.4 34.368 29.888 12.864 7.488 26.048 14.336 39.424 20.544 11.264 5.76 20.864 10.88 28.8 15.552 7.936 4.672 14.4 9.728 19.328 15.168a49.152 49.152 0 0 1 10.56 17.856c2.112 6.464 3.2 14.08 3.2 22.912 0 14.464-4.16 27.456-12.416 38.848-8.32 11.392-20.928 17.088-37.824 17.088-14.848 0-29.824-4.928-44.992-14.784-15.168-9.856-30.464-24.832-46.016-45.056L0 744.32c43.008 43.968 89.728 65.984 140.16 65.984z m536.896 21.76l95.168-21.76-67.712-104.064c16.96-26.88 29.888-57.728 38.912-92.416 8.96-34.688 13.44-72.256 13.44-112.64 0-43.52-5.44-84.032-16.384-121.6a331.52 331.52 0 0 0-45.76-98.176A221.056 221.056 0 0 0 624.64 215.68 173.632 173.632 0 0 0 535.808 192c-32.448 0-62.144 7.872-89.152 23.68a219.456 219.456 0 0 0-69.504 65.664c-19.392 27.968-34.56 60.672-45.504 98.24a433.088 433.088 0 0 0-16.384 121.6c0 43.456 5.44 83.968 16.384 121.472 10.88 37.568 26.112 70.336 45.44 98.304 19.456 27.904 42.624 49.792 69.568 65.6 27.008 15.808 56.704 23.68 89.152 23.68 19.392 0 37.76-2.944 55.296-8.96 17.408-5.888 33.92-14.08 49.408-24.448l36.48 55.168z m-141.248-169.344c-15.168 0-29.568-3.968-43.136-12.032a116.224 116.224 0 0 1-35.712-33.792 178.496 178.496 0 0 1-24.32-51.2 220.352 220.352 0 0 1-8.96-64.512c0-23.296 3.008-44.8 8.96-64.448 6.016-19.712 14.08-36.8 24.32-51.264 10.24-14.528 22.144-25.792 35.712-33.792a83.392 83.392 0 0 1 86.208 0c13.632 8 25.6 19.264 35.968 33.792 10.432 14.464 18.624 31.552 24.64 51.2 5.952 19.712 8.96 41.216 8.96 64.512 0 34.176-6.336 64.192-19.008 90.112l-27.52-42.752-97.856 17.92 59.264 91.648a85.248 85.248 0 0 1-27.52 4.608zM1024 793.92v-128.896h-124.288V208.32h-103.68v585.6H1024z"
                                fill="#00a2dc"
                                p-id="6449"
                            ></path>
                        </svg>
                    </div>
                    <a-tooltip :content="item.paramName">
                        <div class="param-item-label" @click="editParam(item)">
                            {{ item.paramName }}
                        </div>
                    </a-tooltip>
                    <div class="param-item-operation">
                        <a-tooltip content="删除该参数">
                            <a-button type="dashed" size="mini" shape="round" status="danger" @click="deleteParam(item)"
                                ><icon-delete
                            /></a-button>
                        </a-tooltip>
                    </div>
                </div>
            </div>
        </div>
        <div class="no-api-doc" v-else>
            <p>请选择一个 API 以查看详情</p>
        </div>
    </a-card>

    <!-- 新增参数弹窗 -->
    <a-modal
        v-model:visible="createParamModalVisible"
        :title="modalType == 1 ? '新增参数' : '编辑参数'"
        @cancel="createHandleCancel"
        @before-ok="createHandleOk"
        draggable
    >
        <a-form :model="createParamForm" ref="createParamFormRef">
            <a-form-item
                field="paramName"
                label="参数名称"
                :rules="[
                    {
                        required: true,
                        message: '参数名称不能为空'
                    },
                    {
                        match: /^[a-zA-Z0-9_]+$/,
                        message: '参数名称只能包含字母、数字、下划线'
                    }
                ]"
                :validate-trigger="['blur']"
            >
                <a-input v-model="createParamForm.paramName" placeholder="请输入参数名称..." />
            </a-form-item>
            <a-form-item field="isRequired" label="必填">
                <a-radio-group v-model="createParamForm.isRequired">
                    <a-radio value="0">是</a-radio>
                    <a-radio value="1">否</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item
                field="paramType"
                label="参数类型"
                :rules="[
                    {
                        required: true,
                        message: '参数类型不能为空'
                    }
                ]"
                :validate-trigger="['blur']"
            >
                <a-select v-model="createParamForm.paramType" placeholder="请选择参数类型" allow-clear>
                    <a-option value="1">字符串</a-option>
                    <a-option value="2">数字</a-option>
                    <a-option value="3">日期</a-option>
                    <a-option value="4">SQL表达式</a-option>
                </a-select>
            </a-form-item>
            <a-form-item v-if="createParamForm.paramType === '1'" field="paramValue" label="测试值">
                <a-input v-model="createParamForm.paramValue" placeholder="请输入字符串" />
            </a-form-item>

            <a-form-item v-if="createParamForm.paramType === '2'" field="paramValue" label="测试值">
                <a-input-number v-model="createParamForm.paramValue" placeholder="请输入数字" />
            </a-form-item>

            <a-form-item v-if="createParamForm.paramType === '3'" field="paramValue" label="测试值">
                <a-date-picker v-model="createParamForm.paramValue" placeholder="选择日期" />
            </a-form-item>

            <a-form-item v-if="createParamForm.paramType === '4'" field="paramValue" label="SQL表达式">
                <a-textarea v-model="createParamForm.paramValue" placeholder="请输入SQL表达式" allow-clear />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, h, watch, reactive, shallowRef, getCurrentInstance, nextTick, onActivated, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconStar, IconStorage } from '@arco-design/web-vue/es/icon'
import {
    ApiList,
    getApiSql,
    ApiSqlParam,
    addApiSqlParam,
    editApiSqlParam,
    deleteApiSqlParam,
    getApiSqlParamList
} from '@/api/apis'

// 接收父组件传递的 API 对象
const props = defineProps<{
    api: ApiList | null
}>()

const router = useRouter() // 获取路由实例
const route = useRoute() // 获取当前路由对象
const paramList = ref<ApiSqlParam[]>([])
const sqlParamList = async () => {
    if (props.api && props.api.id) {
        const response = await getApiSqlParamList(props.api.id)
        paramList.value = response.data
    }
}
// 初始化加载数据
const init = async () => {
    if (props.api && props.api.id) {
        sqlParamList()
    }
}

// 新增参数弹窗状态变量
const createParamModalVisible = ref(false)

interface CreateParamForm {
    id: number
    apiId: number
    paramName: string
    isRequired: '0' | '1'
    paramType: string // 使用枚举值
    paramValue: any
}

// 新增参数弹窗表单数据
const createParamForm = reactive<CreateParamForm>({
    id: 0,
    apiId: props.api?.id || 0,
    paramName: '',
    isRequired: '0',
    paramType: '1',
    paramValue: undefined
})

// 新增参数弹窗表单校验方法
const createParamFormRef = ref<any>()
const modalType = ref(1) // 1 新建，2 编辑

const resetCreateParamForm = () => {
    createParamForm.id = 0
    createParamForm.apiId = props.api?.id || 0
    createParamForm.paramName = ''
    createParamForm.isRequired = '0'
    createParamForm.paramType = '1'
    createParamForm.paramValue = undefined
}
const createHandleCancel = () => {
    createParamModalVisible.value = false
    resetCreateParamForm()
}

// 新增参数
const createParam = () => {
    createParamModalVisible.value = true
    modalType.value = 1
}
// 编辑参数
const editParam = (item: ApiSqlParam) => {
    createParamForm.id = item.id ?? 0
    createParamForm.apiId = item.apiId
    createParamForm.paramName = item.paramName
    createParamForm.isRequired = item.isRequired ? '1' : '0'
    createParamForm.paramType = item.paramType.toString()

    if (item.paramType.toString() === '2') {
        createParamForm.paramValue = Number(item.paramValue)
    } else {
        createParamForm.paramValue = item.paramValue
    }
    modalType.value = 2
    createParamModalVisible.value = true
}
// 删除参数
const deleteParam = async (item: ApiSqlParam) => {
    if (item.id === undefined) {
        Message.error('参数ID无效')
        return
    }
    const response = await deleteApiSqlParam(item.id)
    if (!response.status) {
        Message.error('参数删除失败')
        return
    }
    // 更新参数列表
    paramList.value = paramList.value.filter(param => param.id !== item.id)
    Message.success(response.message)
}

const createHandleOk = async (done: (closed: boolean) => void) => {
    const isValid = await createParamFormRef.value.validate()
    if (isValid === undefined) {
        // 根据 paramType 转换 paramValue 的类型
        switch (createParamForm.paramType) {
            case '1': // 字符串
                createParamForm.paramValue = String(createParamForm.paramValue)
                break
            case '2': // 数字
                createParamForm.paramValue = createParamForm.paramValue ? String(createParamForm.paramValue) : undefined
                break
            case '3': // 日期
                createParamForm.paramValue = createParamForm.paramValue ? String(createParamForm.paramValue) : undefined
                break
            case '4': // SQL表达式
                createParamForm.paramValue = String(createParamForm.paramValue)
                break
            default:
                createParamForm.paramValue = ''
                break
        }

        // 处理 undefined 和 null
        createParamForm.paramValue =
            createParamForm.paramValue === undefined ||
            createParamForm.paramValue === null ||
            (typeof createParamForm.paramValue === 'string' && createParamForm.paramValue === 'undefined')
                ? ''
                : createParamForm.paramValue

        if (props.api && props.api.id) {
            createParamForm.apiId = props.api.id
            const newParam = {
                ...createParamForm,
                isRequired: Number(createParamForm.isRequired),
                paramType: Number(createParamForm.paramType)
            }
            if (createParamForm.paramName !== '') {
                if (modalType.value === 1) {
                    const response = await addApiSqlParam(newParam)
                    if (!response.status) {
                        Message.error('参数添加失败')
                        return
                    }
                    Message.success('参数添加成功')
                    init()
                } else {
                    // 编辑参数
                    const response = await editApiSqlParam(newParam)
                    if (!response.status) {
                        Message.error('参数编辑失败')
                        return
                    }
                    Message.success('参数编辑成功')
                    init()
                }
            }
        }
        resetCreateParamForm() // 重置表单
        done(true)
    } else {
        Message.error('表单验证失败')
        done(false)
    }
}

// 使用 defineExpose 公开 init 方法
defineExpose({ init })

// 在组件挂载时获取数据
onMounted(() => {
    init()
})

// 监听 api 对象的变化并重新调用 init 方法
watch(
    () => props.api,
    (newApi, oldApi) => {
        if (newApi !== oldApi) {
            init()
        }
    }
)
</script>

<style lang="less" scoped>
.api-sql-param {
    padding: 0px 0px;
    .param-list {
        display: flex;
        flex-direction: column;
        max-height: 400px;
        overflow-y: auto;
        .param-item {
            display: flex;
            flex-direction: row; /* 水平布局 */
            align-items: center; /* 垂直居中 */
            padding: 5px 10px;
            border-bottom: 1px solid #e8e8e8;
            height: 50px;

            .param-item-label {
                padding-left: 10px;
                font-weight: bold;
                overflow: hidden;
                width: 50%;
                // 设置超出显示省略号
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .param-item-label:hover {
                color: #1890ff;
                cursor: pointer;
            }

            .param-item-operation {
                margin-left: auto; /* 将操作按钮推到最右边 */
                display: flex;
                gap: 8px; /* 按钮间距 */
                text-align: left; /* 确保按钮内容左对齐 */
            }
        }
    }
}
.no-api-doc {
    p {
        color: #888;
        text-align: center;
        margin-top: 20px;
        font-size: 15px;
    }
}
</style>
