import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const EXCEPTION: AppRouteRecordRaw = {
    path: '/manager/api', // 注意这里不能用/api，因为/api是系统接口（会当做后端接口请求，导致页面404），而/manager/api是用户自定义接口
    name: 'API接口',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.apis',
        requiresAuth: true,
        icon: 'icon-storage',
        order: 1
    },
    children: [
        {
            path: 'list',
            name: 'API接口列表',
            component: () => import('@/views/api-manager/index.vue'),
            meta: {
                locale: 'menu.apis.list',
                requiresAuth: true
            }
        }
    ]
}

export default EXCEPTION
