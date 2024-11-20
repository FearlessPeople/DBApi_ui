<template>
    <div class="navbar">
        <div class="left-side">
            <a-space>
                <img
                    alt="logo"
                    src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image"
                />
                <a-typography-title :style="{ margin: 0, fontSize: '18px' }" :heading="5"> DBApi </a-typography-title>
                <icon-menu-fold
                    v-if="!topMenu && appStore.device === 'mobile'"
                    style="font-size: 22px; cursor: pointer"
                    @click="toggleDrawerMenu"
                />
            </a-space>
        </div>
        <div class="center-side">
            <Menu v-if="topMenu" />
        </div>
        <ul class="right-side">
            <li>
                <a-tooltip content="GitHub地址">
                    <a-link target="_blank" href="https://github.com/FearlessPeople/DBApi">
                        <svg
                            t="1732087012459"
                            class="icon"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="1460"
                            width="20"
                            height="20"
                        >
                            <path
                                d="M64 512c0 195.2 124.8 361.6 300.8 422.4 22.4 6.4 19.2-9.6 19.2-22.4v-76.8c-134.4 16-140.8-73.6-150.4-89.6-19.2-32-60.8-38.4-48-54.4 32-16 64 3.2 99.2 57.6 25.6 38.4 76.8 32 105.6 25.6 6.4-22.4 19.2-44.8 35.2-60.8-144-22.4-201.6-108.8-201.6-211.2 0-48 16-96 48-131.2-22.4-60.8 0-115.2 3.2-121.6 57.6-6.4 118.4 41.6 124.8 44.8 32-9.6 70.4-12.8 112-12.8 41.6 0 80 6.4 112 12.8 12.8-9.6 67.2-48 121.6-44.8 3.2 6.4 25.6 57.6 6.4 118.4 32 38.4 48 83.2 48 131.2 0 102.4-57.6 188.8-201.6 214.4 22.4 22.4 38.4 54.4 38.4 92.8v112c0 9.6 0 19.2 16 19.2C832 876.8 960 710.4 960 512c0-246.4-201.6-448-448-448S64 265.6 64 512z"
                                fill="#040000"
                                p-id="1461"
                            ></path>
                        </svg>
                    </a-link>
                </a-tooltip>
            </li>
            <li>
                <a-tooltip
                    :content="theme === 'light' ? $t('settings.navbar.theme.toDark') : $t('settings.navbar.theme.toLight')"
                >
                    <a-button class="nav-btn" type="outline" :shape="'circle'" @click="handleToggleTheme">
                        <template #icon>
                            <icon-moon-fill v-if="theme === 'dark'" />
                            <icon-sun-fill v-else />
                        </template>
                    </a-button>
                </a-tooltip>
            </li>

            <li>
                <a-dropdown trigger="hover">
                    <a-avatar :size="32" :style="{ marginRight: '8px', cursor: 'pointer' }">
                        <img v-if="avatar" alt="avatar" :src="avatar" />
                        <template v-else>
                            <span>User</span>
                        </template>
                    </a-avatar>
                    <template #content>
                        <a-doption>
                            <a-space @click="$router.push({ name: 'Info' })">
                                <icon-user />
                                <span>
                                    {{ $t('messageBox.userCenter') }}
                                </span>
                            </a-space>
                        </a-doption>
                        <a-doption>
                            <a-space @click="handleLogout">
                                <icon-export />
                                <span>
                                    {{ $t('messageBox.logout') }}
                                </span>
                            </a-space>
                        </a-doption>
                    </template>
                </a-dropdown>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, inject, getCurrentInstance } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useDark, useToggle, useFullscreen } from '@vueuse/core'
import { useAppStore, useUserStore } from '@/store'
import { LOCALE_OPTIONS } from '@/locale'
import useLocale from '@/hooks/locale'
import useUser from '@/hooks/user'
import Menu from '@/components/menu/index.vue'
import MessageBox from '../message-box/index.vue'

const { proxy } = getCurrentInstance()!
const baseURL = inject('baseURL')

const appStore = useAppStore()
const userStore = useUserStore()
const { logout } = useUser()
const { changeLocale, currentLocale } = useLocale()
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen()
const locales = [...LOCALE_OPTIONS]
const avatar = computed(() => {
    // 检查 userStore.avatar 是否为空值
    if (!userStore.avatar) {
        return null // 如果为空，返回 null
    }
    // 否则拼接 baseURL 和 avatar 路径
    return `${baseURL}/api/${userStore.avatar}`
})

const theme = computed(() => {
    return appStore.theme
})
const topMenu = computed(() => appStore.topMenu && appStore.menu)
const isDark = useDark({
    selector: 'body',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark: boolean) {
        // overridden default behavior
        appStore.toggleTheme(dark)
    }
})
const toggleTheme = useToggle(isDark)
const handleToggleTheme = () => {
    toggleTheme()
}
const setVisible = () => {
    appStore.updateSettings({ globalSettings: true })
}
const refBtn = ref()
const triggerBtn = ref()
const setPopoverVisible = () => {
    const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    })
    refBtn.value.dispatchEvent(event)
}
const handleLogout = () => {
    logout()
}
const setDropDownVisible = () => {
    const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    })
    triggerBtn.value.dispatchEvent(event)
}
const switchRoles = async () => {
    const res = await userStore.switchRoles()
    Message.success(res as string)
}
const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void
</script>

<style scoped lang="less">
.navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
}

.left-side {
    display: flex;
    align-items: center;
    padding-left: 20px;
}

.center-side {
    flex: 1;
}

.right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;

    :deep(.locale-select) {
        border-radius: 20px;
    }

    li {
        display: flex;
        align-items: center;
        padding: 0 10px;
    }

    a {
        color: var(--color-text-1);
        text-decoration: none;
    }

    .nav-btn {
        border-color: rgb(var(--gray-2));
        color: rgb(var(--gray-8));
        font-size: 16px;
    }

    .trigger-btn,
    .ref-btn {
        position: absolute;
        bottom: 14px;
    }

    .trigger-btn {
        margin-left: 14px;
    }
}
</style>

<style lang="less">
.message-popover {
    .arco-popover-content {
        margin-top: 0;
    }
}
</style>
