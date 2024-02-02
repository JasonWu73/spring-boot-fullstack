import { RouterProvider } from 'react-router-dom'

import { router } from '@/routes'
import { Toaster } from '@/shared/components/ui/Toaster'
import { createThemeState } from '@/shared/components/ui/theme-signals'
import { createPanelFoldState } from '@/shared/components/layout/side-menu-signals'
import { createAuthState } from '@/shared/auth/auth-signals'
import { createSplitBillState } from '@/split-bill/split-bill-signals'

// 创建组件外 Signal
createThemeState('system', 'demo-ui-theme')
createPanelFoldState()
createAuthState()
createSplitBillState()

export default function App() {
  return (
    <>
      <RouterProvider router={router}/>

      <Toaster/>
    </>
  )
}
