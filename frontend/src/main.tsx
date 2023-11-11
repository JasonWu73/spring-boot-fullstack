import React from 'react'
import ReactDOM from 'react-dom/client'

import App from '@/App'
import { configureNProgress } from '@/utils/nprogress'

import '@/index.css'

configureNProgress()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
