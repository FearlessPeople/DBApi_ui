<template>
    <a-list :bordered="false">
        <a-list-item>
            <a-list-item-meta>
                <template #avatar>
                    <a-typography-paragraph>
                        {{ $t('userSetting.SecuritySettings.form.label.password') }}
                    </a-typography-paragraph>
                </template>
                <template #description>
                    <div class="content">
                        <a-typography-paragraph>
                            {{ $t('userSetting.SecuritySettings.placeholder.password') }}
                        </a-typography-paragraph>
                    </div>
                    <div class="operation">
                        <a-link @click="handleClick">
                            {{ $t('userSetting.SecuritySettings.button.update') }}
                        </a-link>
                    </div>
                </template>
            </a-list-item-meta>
        </a-list-item>
    </a-list>

    <a-drawer :width="500" :visible="visible" :footer="false" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
        <template #title> 修改密码 </template>
        <a-form ref="formRef" :rules="rules" :model="form" @submit="handleSubmit">
            <a-form-item field="password" label="密码" validate-trigger="blur">
                <a-input-password v-model="form.password" placeholder="请输入密码..." />
            </a-form-item>
            <a-form-item field="password2" label="确认密码" validate-trigger="blur">
                <a-input-password v-model="form.password2" placeholder="请再次输入密码..." />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </a-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import { useUserStore } from '@/store'
import { changePass, BasicInfoModel } from '@/api/user-center'

const userStore = useUserStore()
const visible = ref(false)
const formRef = ref()
const form = reactive({
    password: '',
    password2: ''
})

const rules = {
    password: [{ required: true, message: '密码不能为空' }],
    password2: [
        { required: true, message: '确认密码不能为空' },
        {
            validator: (value: string, cb: (arg0: string | undefined) => void) => {
                if (value !== form.password) {
                    cb('两次密码不一致')
                } else {
                    cb('')
                }
            }
        }
    ]
}

const handleOk = () => {}
const handleClick = () => {
    visible.value = true
}

const handleCancel = () => {
    visible.value = false
}

const handleSubmit = async ({
    errors,
    values
}: {
    errors: Record<string, ValidatedError> | undefined
    values: Record<string, any>
}) => {
    if (!errors) {
        values.id = userStore.id
        const params: BasicInfoModel = {
            ...values,
            email: '',
            nickname: '',
            phoneNumber: '',
            introduction: ''
        }

        const res = await changePass(params)
        console.log(res)

        Message.success('密码修改成功')
        form.password = ''
        form.password2 = ''
        visible.value = false
    } else {
        Message.error('请正确填写密码')
    }
}
</script>

<script lang="ts">
export default {
    name: 'SecuritySettings'
}
</script>

<style scoped lang="less">
:deep(.arco-list-item) {
    border-bottom: none !important;

    .arco-typography {
        margin-bottom: 20px;
    }

    .arco-list-item-meta {
        padding: 0;
    }
}

:deep(.arco-list-item-meta-content) {
    flex: 1;
    border-bottom: 1px solid var(--color-neutral-3);

    .arco-list-item-meta-description {
        display: flex;
        justify-content: space-between;

        .operation {
            margin-right: 6px;
        }
    }
}
</style>
