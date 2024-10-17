<template>
    <a-card :bordered="false">
        <a-space :size="54">
            <a-upload
                :custom-request="customRequest"
                list-type="picture-card"
                :file-list="fileList"
                :show-upload-button="true"
                :show-file-list="false"
                @change="uploadChange"
            >
                <template #upload-button>
                    <a-avatar :size="100" class="info-avatar">
                        <template #trigger-icon>
                            <icon-camera />
                        </template>
                        <img v-if="fileList.length" :src="`${baseURL}/api/${fileList[0].url}`" />
                    </a-avatar>
                </template>
            </a-upload>
            <a-descriptions
                :data="renderData"
                :column="2"
                align="right"
                layout="inline-horizontal"
                :label-style="{
                    width: '140px',
                    fontWeight: 'normal',
                    color: 'rgb(var(--gray-8))'
                }"
                :value-style="{
                    width: '400px',
                    paddingLeft: '8px',
                    textAlign: 'left'
                }"
            >
                <template #value="{ value, data }">
                    <!-- 判断如果是 "是否管理员" 标签 -->
                    <template v-if="data.label === '是否管理员'">
                        <a-tag v-if="value === 0" color="#f53f3f" size="small"> 管理员 </a-tag>
                        <a-tag v-else color="blue" size="small"> 普通用户 </a-tag>
                    </template>
                    <!-- 其他标签的正常值显示 -->
                    <span v-else>{{ value }}</span>
                </template>
            </a-descriptions>
        </a-space>
    </a-card>
</template>

<script lang="ts" setup>
import { onMounted, ref, inject, getCurrentInstance } from 'vue'
import type { FileItem, RequestOption } from '@arco-design/web-vue/es/upload/interfaces'
import { useUserStore } from '@/store'
import { userUploadApi } from '@/api/user-center'
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface'

const { proxy } = getCurrentInstance()!
const baseURL = inject('baseURL')

// 获取用户信息
const userStore = useUserStore()

// 文件对象，表示用户的头像文件
const file = {
    uid: '-2', // 文件的唯一标识
    name: 'avatar.png', // 文件名称
    url: userStore.avatar // 头像的URL路径
}

// 渲染用户信息的数组
const renderData = [
    {
        label: '账号id', // 标签名称
        value: userStore.id // 绑定用户id数据
    },
    {
        label: '昵称',
        value: userStore.nickname
    },
    {
        label: '登录名',
        value: userStore.username
    },
    {
        label: '邮箱',
        value: userStore.email
    },
    {
        label: '手机号',
        value: userStore.phoneNumber
    },
    {
        label: '备注',
        value: userStore.remark
    },
    {
        label: '注册时间',
        value: userStore.createTime
    },
    {
        label: '介绍',
        value: userStore.introduction
    },
    {
        label: '是否管理员',
        value: userStore.isAdmin
    }
] as DescData[]

// 文件列表，用于存储上传的文件信息
const fileList = ref<FileItem[]>([file])

// 上传文件后的回调函数，用于更新文件列表
const uploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
    fileList.value = [fileItem] // 更新文件列表为新上传的文件
}

// 自定义上传请求函数
const customRequest = (options: RequestOption) => {
    // 创建中断控制器，用于在请求中途取消上传
    const controller = new AbortController()

    ;(async function requestWrap() {
        const {
            onProgress, // 上传进度回调
            onError, // 上传错误回调
            onSuccess, // 上传成功回调
            fileItem, // 文件项
            name = 'file' // 表单项名称，默认为 'file'
        } = options

        // 手动调用进度更新
        onProgress(20)

        // 创建FormData对象，封装上传的文件
        const formData = new FormData()
        formData.append(name as string, fileItem.file as Blob)

        // 上传进度监听函数
        const onUploadProgress = (event: ProgressEvent) => {
            let percent
            if (event.total > 0) {
                percent = (event.loaded / event.total) * 100 // 计算上传百分比
            }
            // 调用进度回调，更新进度条
            onProgress(parseInt(String(percent), 10), event)
        }

        try {
            // 调用上传接口，传递文件数据
            const res = await userUploadApi(formData, {
                controller, // 传入中断控制器
                onUploadProgress // 监听上传进度
            })

            // 成功后调用 onSuccess，并将后端返回的数据传递给它
            onSuccess(res)

            // 更新 fileList，使用新的头像 URL
            fileList.value = [
                {
                    uid: fileItem.uid,
                    name: fileItem.name,
                    url: res.data // 设置新的头像 URL
                }
            ]

            userStore.avatar = res.data
        } catch (error) {
            // 上传失败时，调用失败回调函数
            onError(error)
        }
    })()

    return {
        abort() {
            // 调用中断控制器中止上传
            controller.abort()
        }
    }
}
</script>

<script lang="ts">
export default {
    name: 'UserPanel'
}
</script>

<style scoped lang="less">
.arco-card {
    padding: 14px 0 4px 4px;
    border-radius: 4px;
}

:deep(.arco-avatar-trigger-icon-button) {
    width: 32px;
    height: 32px;
    line-height: 32px;
    background-color: #e8f3ff;

    .arco-icon-camera {
        margin-top: 8px;
        color: rgb(var(--arcoblue-6));
        font-size: 14px;
    }
}
</style>
