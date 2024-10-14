import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
  codeId: string;
}

export interface LoginRes {
  token: string;
}

export function getCaptcha() {
  return axios.get(`/api/gv/identifyImage?t=${new Date().getTime()}`, {
    headers: {
      Accept: 'image/png', // 明确指定接收图片类型
    },
    responseType: 'blob', // 确保 Axios 将响应数据处理为 Blob
  });
}

export function login(data: LoginData) {
  return axios.post<LoginRes>('/api/user/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/api/user/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
