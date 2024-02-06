import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { router } from '@/routes'
import { createThemeState, getTheme } from '@/shared/components/ui/theme-signals'
import { createPanelFoldState } from '@/shared/components/layout/side-menu-signals'
import { createAuthState } from '@/shared/auth/auth-signals'

// 创建组件外 Signal
createThemeState('system', 'demo-ui-theme')
createPanelFoldState()
createAuthState()

export default function App() {
  return (
    <>
      <RouterProvider router={router}/>

      <Toaster
        theme={getTheme()}
        richColors
        className="toaster group"
        toastOptions={{
          classNames: {
            toast: 'toast group',
            title: 'group-[.toast]:text-slate-500 group-[.toast]:dark:text-slate-400',
            description: 'group-[.toast]:text-slate-600 group-[.toast]:dark:text-slate-300',
            error: 'group-[.toast]:text-rose-500',
            actionButton:
              'group-[.toast]:text-slate-50 group-[.toast]:rounded group-[.toast]:shadow-sm group-[.toast]:transition-colors group-[.toast]:focus:outline-none group-[.toast]:focus:ring-1 group-[.toast]:focus:shadow-md group-[.toast]:bg-sky-500 group-[.toast]:hover:bg-sky-600 group-[.toast]:hover:shadow-sky-500 group-[.toast]:focus:bg-sky-600 group-[.toast]:focus:ring-sky-400 group-[.toast]:focus:shadow-sky-500 group-[.toast]:dark:text-slate-200',
            cancelButton:
              'group-[.toast]:rounded group-[.toast]:shadow-sm group-[.toast]:transition-colors group-[.toast]:focus:outline-none group-[.toast]:focus:ring-1 group-[.toast]:focus:shadow-md group-[.toast]:text-sky-900 group-[.toast]:bg-slate-100 group-[.toast]:hover:bg-slate-200 group-[.toast]:hover:shadow-slate-300 group-[.toast]:focus:bg-slate-200 group-[.toast]:focus:ring-slate-200 group-[.toast]:focus:shadow-slate-300 group-[.toast]:dark:bg-slate-300 group-[.toast]:dark:hover:bg-slate-400 group-[.toast]:dark:hover:shadow-slate-300 group-[.toast]:dark:focus:bg-slate-400 group-[.toast]:dark:focus:ring-slate-200 group-[.toast]:dark:focus:shadow-slate-300'
          }
        }}
      />
    </>
  )
}
