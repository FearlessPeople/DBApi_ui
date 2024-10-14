# simple admin前端项目



## 项目文件说明

```plaintext
.env.development     # 开发环境的环境变量配置文件
.env.production      # 生产环境的环境变量配置文件
.eslintignore        # 指定 ESLint 忽略的文件和目录
.eslintrc.js         # ESLint 的配置文件
.gitignore           # 指定 Git 忽略的文件和目录
.husky               # Husky 配置目录，管理 Git 钩子（hooks）
.prettierignore      # 指定 Prettier 忽略的文件和目录
.prettierrc.js       # Prettier 的配置文件
.stylelintrc.js      # Stylelint 的配置文件，检查样式代码的规则
babel.config.js      # Babel 的配置文件，将现代 JavaScript 语法转换为兼容版本
commitlint.config.js # Commitlint 的配置文件，定义 Git 提交信息格式
components.d.ts      # Vue 组件的类型声明文件，提供类型支持
package.json         # 项目的依赖管理文件，包含项目信息和依赖列表
pnpm-lock.yaml       # pnpm 包管理器的锁定文件，锁定项目依赖的具体版本
tsconfig.json        # TypeScript 的配置文件，定义编译器行为和编译选项
config               # 配置目录
  ├── utils                   # 工具函数目录，存放与配置相关的辅助函数
  ├── vite.config.base.ts     # Vite 的基础配置文件，包含开发和生产环境的通用配置
  ├── vite.config.dev.ts      # Vite 的开发环境配置文件，扩展和覆盖基础配置以适应开发需求
  ├── vite.config.prod.ts     # Vite 的生产环境配置文件，扩展和优化基础配置以适应生产部署
src                  # 源码目录
  ├── App.vue        # 根组件，应用的入口组件
  ├── api            # 存放 API 请求的模块，统一管理与后端的接口交互
  ├── assets         # 静态资源目录，如图片、样式表等
  ├── components     # 可复用的 Vue 组件目录
  ├── config         # 配置文件目录，包含项目的全局配置
  ├── directive      # 自定义指令目录，用于定义 Vue 的全局指令
  ├── env.d.ts       # TypeScript 环境配置文件，定义全局的类型声明
  ├── hooks          # 自定义钩子函数目录，封装通用逻辑
  ├── layout         # 布局组件目录，定义应用的整体布局结构
  ├── locale         # 国际化相关文件目录，处理多语言支持
  ├── main.ts        # 应用的入口文件，初始化并挂载 Vue 实例
  ├── mock           # 模拟数据目录，开发环境中模拟 API 接口数据
  ├── router         # 路由配置目录，管理应用的路由和导航
  ├── store          # 状态管理目录，使用 Pinia 或 Vuex 管理全局状态
  ├── types          # 全局类型声明目录，定义项目中使用的类型
  ├── utils          # 工具函数目录，封装常用的辅助函数
  ├── views          # 视图组件目录，定义应用的各个页面
```