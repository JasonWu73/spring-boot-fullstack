import { RouterProvider } from 'react-router-dom'

import { router } from '@/Routes'
import { Toaster } from '@/shared/components/ui/Toaster'
import { createAuthState } from '@/shared/auth/auth'
import { createPanelFoldState } from '@/shared/components/layout/panel-fold/panel-fold'
import { createThemeState } from '@/shared/components/ui/theme'

// 创建组件外 Signal
createThemeState('system', 'demo-ui-theme')
createAuthState()
createPanelFoldState()

export default function App() {
  return (
    <>
      <RouterProvider router={router} />

      <Toaster />
    </>
  )
}
