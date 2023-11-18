import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { AuthProvider } from '@/auth/AuthProvider'
import { SecureRoute } from '@/auth/SecureRoute'
import AdminLayout from '@/shared/components/layout/AdminLayout'
import LoginLayout from '@/shared/components/layout/LoginLayout'
import MainLayout from '@/shared/components/layout/MainLayout'
import { PanelFoldProvider } from '@/shared/components/layout/panel-fold/PanelFoldProvider'
import { Spinner } from '@/shared/components/Spinner'
import { ThemeProvider } from '@/shared/components/ui/ThemeProvider'
import { Toaster } from '@/shared/components/ui/Toaster'
import { wait } from '@/shared/utils/helpers'
import { FriendProvider } from '@/split-bill/FriendProvider'
import { VersionProvider } from '@/version/VersionProvider'

const LoginPage = React.lazy(() => import('@/auth/LoginPage'))
const RandomProductPage = React.lazy(() => import('@/product/RandomProductPage'))
const SplitBillPage = React.lazy(() => import('@/split-bill/SplitBillPage'))
const NotFoundPage = React.lazy(() => import('@/shared/components/NotFoundPage'))
const UserListPage = React.lazy(() => import('@/user/UserListPage'))

// 测试 React Router 懒加载（React Split Code）
const SplitBillForm = React.lazy(() =>
  wait(2).then(() =>
    import('@/split-bill/SplitBillForm').then((module) => ({
      default: module.SplitBillForm
    }))
  )
)

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
        element: <SecureRoute authority="user" />,
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
        element: <SecureRoute authority="admin" />,
        children: [
          { path: '/admin', element: <Navigate to="/users" replace /> },
          { path: '/users', element: <UserListPage /> }
        ]
      },
      {
        element: <SecureRoute authority="root" />,
        children: [{ path: '/product', element: <RandomProductPage /> }]
      }
    ]
  }
])

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="demo-ui-theme">
      <VersionProvider>
        <AuthProvider>
          <RouterProvider router={router} />

          <Toaster />
        </AuthProvider>
      </VersionProvider>
    </ThemeProvider>
  )
}
