import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const LIST: AppRouteRecordRaw = {
    path: '/sys',
    name: 'sys',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.sys',
        requiresAuth: true,
        icon: 'icon-settings',
        order: 10
    },
    children: [
        {
            path: 'user-manager',
            name: 'UserManager',
            component: () => import('@/views/sys-setting/user-manager/index.vue'),
            meta: {
                locale: 'menu.sys.userManager',
                requiresAuth: true,
                permissions: ['sys:user:list']
            }
        },
        {
            path: 'role',
            name: 'role',
            component: () => import('@/views/sys-setting/role/index.vue'),
            meta: {
                locale: 'menu.sys.role',
                requiresAuth: true,
                permissions: ['sys:role:list']
            }
        }
    ]
}

export default LIST
