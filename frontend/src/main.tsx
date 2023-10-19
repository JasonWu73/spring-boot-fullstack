import React from 'react'
import ReactDOM from 'react-dom/client' // REACT 18
// import ReactDOM from 'react-dom' // REACT 17
import { BrowserRouter } from 'react-router-dom'

import App from '@/App'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { nprogressConfig } from '@/lib/nprogress-config'
import '@/index.css'

nprogressConfig()

// REACT 18
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="demo-ui-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
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
