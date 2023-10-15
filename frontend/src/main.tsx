import React from 'react'
import ReactDOM from 'react-dom/client' // REACT 18
// import ReactDOM from 'react-dom' // REACT 17

import App from '@/App'
import '@/index.css'
import { nprogressConfig } from '@/lib/nprogress-config'

nprogressConfig()

// REACT 18
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// REACT 17
/*
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
*/
