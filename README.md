# Backend

## REST API Endpoints

```text
GET  /orders          <---> orders
POST /orders          <---> orders.push(data)
GET  /orders/1        <---> orders[1]
PUT  /orders/1        <---> orders[1] = data
GET  /orders/1/lines  <---> orders[1].lines
POST /orders/1/lines  <---> orders[1].lines.push(data)
```

# Frontend

## 创建项目

```bash
# Vite 创建 React + TypeScript 项目
npm create vite@latest my-react-app -- --template react-ts

# 去除意义不大的 ESLint 规则插件
npm uninstall eslint-plugin-react-refresh

# 配置别名

# 1. 修改 `tsconfig.json` 在 `compilerOptions` 中添加：
#
#   /* 配置别名 */
#   "baseUrl": "./",
#   "paths": {
#     "@/*": ["./src/*"]
#   }
#
# 2. 修改 `vite.config.ts` 在 `resolve` 中添加：
#
#   // 配置别名
#   alias: {
#     "@": path.resolve(__dirname, "./src")
#   }

# 安装 Node 的类型定义，避免 IDE 因无法识别 Node 类型的而产生的警告
npm install --save-dev @types/node

# 安装 Prettier
#
# 1. `.prettierignore` 与 `.gitignore` 内容一致
#
# 2. `prettier.config.js`
#
# 3. `package.json` 中 `scripts` 添加（添加后运行 `npm run check` 以检查 Prettier 是否配置正确）：
#
#   3.1 "check": "prettier --check ."
#
#   3.2 "reformat": "prettier --write ."
npm install --save-dev --save-exact prettier

# 安装 `eslint-config-prettier`，关闭所有不必要或可能与 Prettier 冲突的 ESLint 规则
# 调整 `.eslintrc.cjs`，在 `extends` 的最后一项添加 `prettier`
npm install --save-dev eslint-config-prettier

# 安装 Tailwind CSS 的 Prettier 插件
#
# 调整 `prettier.config.js`：
#
# 1. 添加 `tailwindFunctions: ["clsx", "tw"]`
#
# 2. 在 `plugins` 的最后一项添加 `"prettier-plugin-tailwindcss"`
npm install --save-dev prettier-plugin-tailwindcss

# 安装 Tailwind CSS
npm install --save-dev tailwindcss postcss autoprefixer

# 生成 `tailwind.config.js` 和 `postcss.config.js` 文件
npx tailwindcss init -p

# 生成 shadcn/ui 的配置文件 `components.json`
# 可直接拷贝已有的 `components.json` 和 `tailwind.config.js` 使用
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
