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
# Vite 创建 React + TS 项目
npm create vite@latest my-react-app -- --template react-ts

# 安装 Node 的类型定义，避免 IDE 因无法识别 Node 类型的而产生的警告
npm install --save-dev @types/node

# 安装 Prettier
npm install --save-dev --save-exact prettier

# 安装 `eslint-config-prettier`，关闭所有不必要或可能与 Prettier 冲突的 ESLint 规则
npm install --save-dev eslint-config-prettier

# 安装 Tailwind CSS 的 Prettier 插件
npm install --save-dev prettier-plugin-tailwindcss

# 安装 Tailwind CSS
npm install --save-dev tailwindcss postcss autoprefixer

# 生成 `tailwind.config.js` 和 `postcss.config.js` 文件
npx tailwindcss init -p

# 安装 NProgress
npm install nprogress
npm install --save-dev @types/nprogress

# 安装 React Router
npm install react-router-dom

# 安装 shadcn/ui
npx shadcn-ui@latest init
```

## Tutorials

[The Ultimate React Course 2023: React, Redux & More](https://www.udemy.com/course/the-ultimate-react-course/)
