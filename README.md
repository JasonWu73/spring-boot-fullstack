# 前后端分离项目

## 后端项目

### REST API Endpoints

```text
GET  /orders          <---> orders
POST /orders          <---> orders.push(data)
GET  /orders/1        <---> orders[1]
PUT  /orders/1        <---> orders[1] = data
GET  /orders/1/lines  <---> orders[1].lines
POST /orders/1/lines  <---> orders[1].lines.push(data)
```

## 前端项目

```bash
# Vite 创建 React + TypeScript 项目
npm create vite@latest react-app -- --template react-ts

# 去除意义不大的 ESLint 规则插件
npm uninstall eslint-plugin-react-refresh

# 调整配置

# 1. `tsconfig.json`
#
# ```json
# {
#   "compilerOptions": {
#     // ...
#     "allowImportingTsExtensions": false, // import TS 文件时不用指定 `.tsx` 后缀
#     // ...
#
#     /* 配置别名 */
#     "baseUrl": "./",
#     "paths": {
#       "@/*": ["./src/*"]
#     }
#   },
#   // ...
# }
# ```

# 2. `vite.config.ts`
#
# ```ts
# // ...
# import path from 'path'
# 
# // https://vitejs.dev/config/
# export default defineConfig({
#   // ...
# 
#   resolve: {
#     // 配置别名
#     alias: {
#       '@': path.resolve(__dirname, './src')
#     }
#   }
# })
# ```

# 安装 Node 的类型定义，避免 IDE 因无法识别 Node 类型的而产生的警告
npm install --save-dev @types/node

# 安装 Tailwind CSS
npm install --save-dev tailwindcss postcss autoprefixer

# 生成 `tailwind.config.js` 和 `postcss.config.js` 文件
# 其中 `tailwind.config.js` 文件内容会被 `shadcn/ui` 初始化命令所覆盖
npx tailwindcss init -p

# 生成 shadcn/ui 的配置文件 `components.json`
# ```json
# {
#   "$schema": "https://ui.shadcn.com/schema.json",
#   "style": "new-york",
#   "rsc": false,
#   "tsx": true,
#   "tailwind": {
#     "config": "tailwind.config.js",
#     "css": "src/index.css",
#     "baseColor": "slate",
#     "cssVariables": false
#   },
#   "aliases": {
#     "components": "@/shared/components",
#     "utils": "@/shared/utils/helpers"
#   }
# }
# ```
npx shadcn-ui@latest init

# 安装 NProgress
npm install nprogress
npm install --save-dev @types/nprogress

# 安装 React Router
npm install react-router-dom

# 安装信号库（比 Redux 更简单易用的全局状态管理库）
npm install @preact/signals-react
npm install --save-dev @types/use-sync-external-store
```
