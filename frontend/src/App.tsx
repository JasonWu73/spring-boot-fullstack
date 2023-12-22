import { RouterProvider } from 'react-router-dom'

import { router } from '@/Routes'
import { Toaster } from '@/shared/components/ui/Toaster'
import { createAuthState } from '@/shared/signals/auth'
import { createPanelFoldState } from '@/shared/signals/panel-fold'
import { createThemeState } from '@/shared/signals/theme'

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
