import axios from 'axios';
import { ApiResponse } from './types';

export interface BasicInfoModel {
    id?: number;
    email: string;
    nickname: string;
    password?: string;
    phoneNumber: string;
    introduction: string;
}

export interface EnterpriseCertificationModel {
    accountType: number;
    status: number;
    time: string;
    legalPerson: string;
    certificateType: string;
    authenticationNumber: string;
    enterpriseName: string;
    enterpriseCertificateType: string;
    organizationCode: string;
}

// 上传用户头像
export function userUploadApi(
    data: FormData,
    config: {
        controller: AbortController;
        onUploadProgress?: (progressEvent: any) => void;
    }
) {
    // const controller = new AbortController();
    return axios.post('/api/user/upload', data, config);
}

// 修改用户个人信息
export function saveUserInfo(params: BasicInfoModel) {
    return axios.post<ApiResponse<string>>('/api/user/update', params);
}

// 修改密码
export function changePass(params: BasicInfoModel) {
    return axios.post<ApiResponse<string>>('/api/user/update', params);
}
