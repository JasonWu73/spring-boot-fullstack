import React from 'react'
import ReactDOM from 'react-dom/client'

import App from '@/App'
import { nprogressConfig } from '@/lib/nprogress-config'
import '@/index.css'
import '@/index-provided.css'

nprogressConfig()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
