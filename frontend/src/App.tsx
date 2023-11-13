import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { AuthProvider } from '@/features/auth/AuthProvider'
import { SecureRoute } from '@/features/auth/SecureRoute'
import { FriendProvider } from '@/features/split-bill/FriendProvider'
import AdminLayout from '@/ui/layout/AdminLayout'
import LoginLayout from '@/ui/layout/LoginLayout'
import MainLayout from '@/ui/layout/MainLayout'
import { PanelFoldProvider } from '@/ui/layout/panel-fold/PanelFoldProvider'
import { ThemeProvider } from '@/ui/shadcn-ui/ThemeProvider'
import { Toaster } from '@/ui/shadcn-ui/Toaster'
import { Spinner } from '@/ui/Spinner'
import { wait } from '@/utils/helpers'

const LoginPage = React.lazy(() => import('@/features/auth/LoginPage'))
const RandomProductPage = React.lazy(
  () => import('@/features/product/RandomProductPage')
)
const SplitBillPage = React.lazy(
  () => import('@/features/split-bill/SplitBillPage')
)
const NotFoundPage = React.lazy(() => import('@/ui/NotFoundPage'))
const UserListPage = React.lazy(() => import('@/features/user/UserListPage'))

// ----- 开始：测试 React Router 懒加载（React Split Code）-----
const SplitBillForm = React.lazy(() =>
  wait(2).then(() =>
    import('@/features/split-bill/SplitBillForm').then((module) => ({
      default: module.SplitBillForm
    }))
  )
)
// ----- 结束：测试 React Router 懒加载（React Split Code）-----

const router = createBrowserRouter([
  {
    element: <LoginLayout />,
    children: [{ path: '/login', element: <LoginPage /> }]
  },

  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to="/split-bill" replace /> },
      {
        element: <SecureRoute />,
        children: [{ path: '/fetch', element: <RandomProductPage /> }]
      },
      {
        path: '/split-bill',
        element: (
          <FriendProvider>
            <SplitBillPage />
          </FriendProvider>
        ),
        children: [
          {
            path: ':friendId',
            element: (
              <React.Suspense fallback={<Spinner />}>
                <SplitBillForm />
              </React.Suspense>
            )
          }
        ]
      },
      { path: '*', element: <NotFoundPage /> }
    ]
  },

  {
    element: (
      <PanelFoldProvider>
        <AdminLayout />
      </PanelFoldProvider>
    ),
    children: [
      {
        element: <SecureRoute />,
        children: [
          { path: '/admin', element: <Navigate to="/users" replace /> },
          { path: '/users', element: <UserListPage /> },
          { path: '/product', element: <RandomProductPage /> }
        ]
      }
    ]
  }
])

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="demo-ui-theme">
      <AuthProvider>
        <RouterProvider router={router} />

        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
