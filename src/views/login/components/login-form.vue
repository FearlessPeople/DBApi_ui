<template>
    <div class="login-form-wrapper">
        <div class="login-form-title">{{ $t('login.form.title') }}</div>
        <div class="login-form-sub-title">一个快速将SQL转换为API接口的平台</div>
        <div class="login-form-error-msg">{{ errorMessage }}</div>
        <a-form ref="loginForm" :model="userInfo" class="login-form" layout="vertical" @submit="handleSubmit">
            <a-form-item
                field="username"
                :rules="[
                    {
                        required: true,
                        message: $t('login.form.userName.errMsg')
                    }
                ]"
                :validate-trigger="['change', 'blur']"
                hide-label
            >
                <a-input v-model="userInfo.username" :placeholder="$t('login.form.userName.placeholder')">
                    <template #prefix>
                        <icon-user />
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item
                field="password"
                :rules="[
                    {
                        required: true,
                        message: $t('login.form.password.errMsg')
                    }
                ]"
                :validate-trigger="['change', 'blur']"
                hide-label
            >
                <a-input-password v-model="userInfo.password" :placeholder="$t('login.form.password.placeholder')" allow-clear>
                    <template #prefix>
                        <icon-lock />
                    </template>
                </a-input-password>
            </a-form-item>
            <a-form-item
                class="login-form-check"
                field="checkCode"
                :rules="[
                    {
                        required: true,
                        length: 5,
                        message: $t('login.form.checkCode.errMsg')
                    }
                ]"
                :validate-trigger="['change', 'blur']"
                hide-label
            >
                <a-input minWidth="100%" v-model="userInfo.checkCode" :placeholder="$t('login.form.checkCode.placeholder')">
                    <template #prefix>
                        <icon-safe />
                    </template>
                </a-input>
                <div>
                    <a-tooltip content="点击更新验证码">
                        <img width="100" height="30" :src="captchaSrc" alt="点击更新验证码" @click="refreshCaptcha" />
                    </a-tooltip>
                </div>
            </a-form-item>
            <a-space :size="16" direction="vertical">
                <div class="login-form-password-actions">
                    <a-checkbox
                        checked="rememberPassword"
                        :model-value="loginConfig.rememberPassword"
                        @change="setRememberPassword as any"
                    >
                        {{ $t('login.form.rememberPassword') }}
                    </a-checkbox>
                    <a-link>{{ $t('login.form.forgetPassword') }}</a-link>
                </div>
                <a-button type="primary" html-type="submit" long :loading="loading">
                    {{ $t('login.form.login') }}
                </a-button>
                <!-- <a-button type="text" long class="login-form-register-btn">
                    {{ $t('login.form.register') }}
                </a-button> -->
            </a-space>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { useUserStore } from '@/store'
import useLoading from '@/hooks/loading'
import { LoginData, getCaptcha } from '@/api/user'
import axios from 'axios'

const router = useRouter()
const { t } = useI18n()
const errorMessage = ref('')
const { loading, setLoading } = useLoading()
const userStore = useUserStore()

const captchaSrc = ref('')
const codeId = ref('') // 用于存储codeid

const refreshCaptcha = async () => {
    try {
        const response = await getCaptcha() // 等待 getCaptcha 请求完成
        const blob = new Blob([response.data], { type: 'image/png' })
        captchaSrc.value = URL.createObjectURL(blob) // 如果使用 Vue 的响应式属性，可以在这里设置图片的 URL
        codeId.value = response.headers.codeid // 获取响应头中的 codeid
    } catch (error) {
        console.error('获取验证码失败', error) // 捕获错误并输出
    }
}

const loginConfig = useStorage('login-config', {
    rememberPassword: true,
    username: 'admin', // 演示默认值
    password: 'admin', // demo default value
    checkCode: ''
})
const userInfo = reactive({
    username: loginConfig.value.username,
    password: loginConfig.value.password,
    checkCode: loginConfig.value.checkCode
})

const handleSubmit = async ({
    errors,
    values
}: {
    errors: Record<string, ValidatedError> | undefined
    values: Record<string, any>
}) => {
    if (loading.value) return
    if (!errors) {
        setLoading(true)
        try {
            // 准备登录数据并发送请求，在登录请求中携带codeId
            const loginData = {
                ...values,
                codeId: codeId.value
            }
            await userStore.login(loginData as LoginData)
            // 跳转到登录后的页面
            const { redirect, ...othersQuery } = router.currentRoute.value.query
            router.push({
                name: (redirect as string) || 'Workplace',
                query: {
                    ...othersQuery
                }
            })
            // 显示登录成功提示
            Message.success(t('login.form.login.success'))
            // 记住用户名和密码
            const { rememberPassword } = loginConfig.value
            const { username, password } = values
            loginConfig.value.username = rememberPassword ? username : ''
            loginConfig.value.password = rememberPassword ? password : ''
        } catch (err: any) {
            const errorMsg = err.message || '登录失败'
            errorMessage.value = errorMsg
            Message.error(errorMsg)
            refreshCaptcha()
        } finally {
            setLoading(false)
        }
    }
}

onMounted(() => {
    refreshCaptcha()
})

const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value
}
</script>

<style lang="less" scoped>
.login-form {
    &-wrapper {
        width: 320px;
    }

    &-title {
        color: var(--color-text-1);
        font-weight: 500;
        font-size: 24px;
        line-height: 32px;
    }

    &-sub-title {
        color: var(--color-text-3);
        font-size: 16px;
        line-height: 24px;
    }

    &-error-msg {
        height: 32px;
        color: rgb(var(--red-6));
        line-height: 32px;
    }

    &-password-actions {
        display: flex;
        justify-content: space-between;
    }

    &-register-btn {
        color: var(--color-text-3) !important;
    }

    .login-form-check {
        img {
            padding: 2px;
        }
    }
}
</style>
