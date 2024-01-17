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
npm create vite@latest react-app -- --template react-ts

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

## 教程

- [The Ultimate React Course 2024: React, Redux & More](https://www.udemy.com/course/the-ultimate-react-course/)
- [https://www.udemy.com/course/react-the-complete-guide-incl-redux/](https://www.udemy.com/course/react-the-complete-guide-incl-redux/)
