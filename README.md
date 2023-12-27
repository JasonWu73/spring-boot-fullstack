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

# 配置别名
# 1. 修改 `tsconfig.json` 在 `compilerOptions` 中添加：
#    /* 配置别名 */
#    "baseUrl": "./",
#    "paths": {
#      "@/*": ["./src/*"]
#    },
# 2. 修改 `vite.config.ts` 在 `resolve.alias` 中添加：
#  resolve: {
#    // 配置别名
#    alias: {
#      '@': path.resolve(__dirname, './src')
#    }
#  }

# 安装 Node 的类型定义，避免 IDE 因无法识别 Node 类型的而产生的警告
npm install --save-dev @types/node

# 安装 Prettier
# 1. `.prettierignore` 与 `.gitignore` 内容一致
# 2. `prettier.config.js`
# 3. `package.json` 中 `scripts` 添加：
# 3.1 "check": "prettier --check ."
# 3.2 "reformat": "prettier --write ."
npm install --save-dev --save-exact prettier

# 安装 `eslint-config-prettier`，关闭所有不必要或可能与 Prettier 冲突的 ESLint 规则
# 调整 `.eslintrc.cjs`，在 `extends` 的最后一项添加 `prettier`
npm install --save-dev eslint-config-prettier

# 安装 Tailwind CSS 的 Prettier 插件
# 调整 `prettier.config.js`，
# 1. 添加 `tailwindFunctions: ['clsx', 'tw']`
# 2. 在 `plugins` 的最后一项添加 `prettier-plugin-tailwindcss`
npm install --save-dev prettier-plugin-tailwindcss

# 安装 Tailwind CSS
npm install --save-dev tailwindcss postcss autoprefixer

# 生成 `tailwind.config.js` 和 `postcss.config.js` 文件
npx tailwindcss init -p

# 安装 shadcn/ui
# 调整 `components.json`
npx shadcn-ui@latest init

# 安装 NProgress
npm install nprogress
npm install --save-dev @types/nprogress

# 安装 React Router
npm install react-router-dom

# 安装信号库（更好的状态管理库）
npm install @preact/signals-react
npm install --save @types/use-sync-external-store
```

## Docs

- Tailwind CSS
  - [Install Tailwind CSS with Vite | Tailwind CSS](https://tailwindcss.com/docs/guides/vite)
  - [Configuration | Tailwind CSS](https://tailwindcss.com/docs/configuration)
  - [Content | Tailwind CSS](https://tailwindcss.com/docs/content-configuration)

- shadcn/ui
  - [Vite | shadcn/ui](https://ui.shadcn.com/docs/installation/vite)
  - [Dark mode | vite | shadcn/ui](https://ui.shadcn.com/docs/dark-mode/vite)

- Preact.js/signals
  - [React Signals | preactjs/signals | GitHub](https://github.com/preactjs/signals/blob/main/packages/react/README.md)
  - [Introducing Signals | Preact](https://preactjs.com/blog/introducing-signals/)

## Tutorials

- [The Ultimate React Course 2024: React, Redux & More | Udemy](https://www.udemy.com/course/the-ultimate-react-course/)
