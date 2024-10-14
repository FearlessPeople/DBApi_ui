import { DEFAULT_LAYOUT } from '../base'
import { AppRouteRecordRaw } from '../types'

const EXCEPTION: AppRouteRecordRaw = {
    path: '/datasource',
    name: '数据源',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.datasource',
        requiresAuth: true,
        icon: 'icon-storage',
        order: 6
    },
    children: [
        {
            path: 'datasource',
            name: '数据源列表',
            component: () => import('@/views/datasource/index.vue'),
            meta: {
                locale: 'menu.datasource.list',
                requiresAuth: true,
                roles: ['admin']
            }
        }
    ]
}

export default EXCEPTION
