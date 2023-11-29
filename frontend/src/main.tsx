import React from 'react'
import ReactDOM from 'react-dom/client'

import App from '@/App'
import { configureNProgress } from '@/shared/utils/nprogress'

// 自定义样式放在最后，覆盖前面的样式
import '@/index.css'

configureNProgress()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
