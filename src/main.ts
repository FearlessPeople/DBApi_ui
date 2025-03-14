import { createApp } from 'vue'
import axios from 'axios' // 第三方库的引入应在相对路径模块之前
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import globalComponents from '@/components'
import router from './router'
import store from './store'
import i18n from './locale'
import directive from './directive'
// import './mock';
import App from './App.vue'
// Styles are imported via arco-plugin. See config/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import '@/assets/style/global.less'
import '@/api/interceptor'

const app = createApp(App)

// 在这里将 axios.defaults.baseURL 设置为 Vue 全局属性
// app.config.globalProperties.$baseURL = axios.defaults.baseURL;

// 使用 provide 将 baseURL 注入到整个应用中，然后vue中使用const baseURL = inject('baseURL')
app.provide('baseURL', axios.defaults.baseURL)

app.use(ArcoVue, {})
app.use(ArcoVueIcon)

app.use(router)
app.use(store)
app.use(i18n)
app.use(globalComponents)
app.use(directive)

app.mount('#app')
