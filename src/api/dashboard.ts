import axios from 'axios'
import type { TableData } from '@arco-design/web-vue/es/table/interface'
import { ApiResponse, PageDataResponse } from './types' // 非类型导入在后

export interface ContentDataRecord {
    x: string
    y: number
}

export function queryContentData() {
    return axios.get<ContentDataRecord[]>('/api/workplace/apiTrend')
}

export interface PopularRecord {
    key: number
    clickNumber: string
    title: string
    increases: number
}

export function queryPopularList(params: { type: string }) {
    return axios.get<TableData[]>('/api/popular/list', { params })
}

export interface PanelDataRecord {
    apiCount: number
    datasourceCount: number
    requestCount: number
    yesterdayRequestCount: number
}
export function workplaceData() {
    return axios.get<any, ApiResponse<PanelDataRecord>>('/api/workplace/data')
}
