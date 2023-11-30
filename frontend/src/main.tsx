import React from 'react'
import ReactDOM from 'react-dom/client'

import App from '@/App'
import { configureNProgress } from '@/shared/utils/nprogress'

// 自定义样式放在最后，覆盖前面的样式
import '@/index.css'

configureNProgress()

/* 通过 React 18 `createRoot` API 将 `App` 组件作为根组件渲染到 `id="root"` 的 HTML 元素中 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

/*
 * React 分为两个阶段：
 *
 * 1. Render 阶段：决定了需要对 DOM 进行哪些更改
 *
 * 2. Commit 阶段：将 Render 阶段的更改应用到 DOM 上，并调用生命周期函数
 * */

/* StrictMode：仅对开发模式下生效，并不会对生产构建产生任何影响
 *
 * 1. 警告那些在未来版本的 React 中可能会被废弃的 API
 *
 * 2. 组件函数会被调用两次，即 `render` 方法会被调用两次
 *
 * 3. 某些 Hook 也会被调用两次
 *
 * 3.1 `const [state, setState] = useState(initialState)`
 * 3.1.1 `initialState` 函数（若为函数）会被调用两次
 * 3.1.2 `setState` 函数会被调用两次
 *
 * 3.2 `const [state, dispatch] = useReducer(reducer, initialArg, init?)`：
 *   `reducer` 和 `init` 函数会被调用两次
 *
 * 3.3 `useEffect(setup, dependencies?)`
 *   和 `useLayoutEffect(setup, dependencies?)`：
 *   会先执行一个 setup+cleanup cycle，再执行 setup
 *
 * 3.4 `const cachedValue = useMemo(calculateValue, dependencies)`：
 *   `calculateValue` 函数会被调用两次
 * */
