<template>
  <a-form ref="formRef" :model="formData" class="form" auto-label-width :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }">
    <a-form-item field="nickname" :label="$t('userSetting.basicInfo.form.label.nickname')" :rules="[
      {
        required: true,
        message: $t('userSetting.form.error.nickname.required'),
      },
    ]">
      <a-input v-model="formData.nickname" :placeholder="$t('userSetting.basicInfo.placeholder.nickname')" />
    </a-form-item>
    <a-form-item field="email" :label="$t('userSetting.basicInfo.form.label.email')" :rules="[
      {
        required: true,
        message: $t('userSetting.form.error.email.required'),
      },
    ]">
      <a-input v-model="formData.email" :placeholder="$t('userSetting.basicInfo.placeholder.email')" />
    </a-form-item>
    <a-form-item field="phoneNumber" label="手机号" :rules="[
      {
        required: true,
        message: '手机号不能为空',
      },
    ]">
      <a-input v-model="formData.phoneNumber" placeholder="请输入手机号" />
    </a-form-item>

    <a-form-item field="introduction" label="个人介绍" :rules="[
      {
        maxLength: 200,
        message: '请输入个人介绍',
      },
    ]" row-class="keep-margin">
      <a-textarea v-model="formData.introduction" placeholder="请输入个人介绍" />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validate">
          {{ $t('userSetting.save') }}
        </a-button>
        <a-button type="secondary" @click="reset">
          {{ $t('userSetting.reset') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { BasicInfoModel, saveUserInfo } from '@/api/user-center';
import { useUserStore } from '@/store';
import { Message } from '@arco-design/web-vue';

// 获取用户信息
const userStore = useUserStore();

const formRef = ref<FormInstance>();
const formData = ref<BasicInfoModel>({
  id: (userStore.id as unknown as number),
  email: (userStore.email as unknown as string),
  nickname: (userStore.nickname as unknown as string),
  phoneNumber: (userStore.phoneNumber as unknown as string),
  introduction: (userStore.introduction as unknown as string),
});

// 验证表单并提交保存
const validate = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    const params: BasicInfoModel = {
      ...formData.value
    };
    const data = await saveUserInfo(params);
    if (data.status) {
      Message.success(data.message)
    } else {
      Message.error(data.message)
    }
  }
};
// 重置表单
const reset = async () => {
  await formRef.value?.resetFields();
};
</script>

<style scoped lang="less">
.form {
  width: 540px;
  margin: 0 auto;
}
</style>
