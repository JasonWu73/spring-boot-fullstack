import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { AuthProvider } from '@/shared/auth/AuthProvider'
import { SecureRoute } from '@/shared/auth/SecureRoute'
import { AdminLayout } from '@/shared/components/layout/AdminLayout'
import { LoginLayout } from '@/shared/components/layout/LoginLayout'
import { MainLayout } from '@/shared/components/layout/MainLayout'
import { PanelFoldProvider } from '@/shared/components/layout/panel-fold/PanelFoldProvider'
import { Loading } from '@/shared/components/ui/Loading'
import { Toaster } from '@/shared/components/ui/Toaster'
import { createThemeState } from '@/shared/store/theme-state'
import { wait } from '@/shared/utils/helpers'
import { VersionProvider } from '@/shared/version/VersionProvider'
import { FriendProvider } from '@/split-bill/FriendProvider'

const NotFoundPage = React.lazy(() => import('@/shared/components/ui/NotFoundPage'))
const LoginPage = React.lazy(() => import('@/shared/auth/LoginPage'))
const ProfilePage = React.lazy(() => import('@/user/ProfilePage'))
const RandomProductPage = React.lazy(() => import('@/product/RandomProductPage'))
const SplitBillPage = React.lazy(() => import('@/split-bill/SplitBillPage'))
const UserListPage = React.lazy(() => import('@/user/UserListPage'))
const AddUserPage = React.lazy(() => import('@/user/AddUserPage'))
const UpdateUserPage = React.lazy(() => import('@/user/UpdateUserPage'))
const OperationLogListPage = React.lazy(
  () => import('@/operation-log/OperationLogListPage')
)

// 测试 React Router 懒加载（React Split Code）
const SplitBillForm = React.lazy(() =>
  wait(2).then(() =>
    import('@/split-bill/SplitBill').then((module) => ({
      default: module.SplitBill
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
        element: <SecureRoute />,
        children: [{ path: '/profile', element: <ProfilePage /> }]
      },
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
              <React.Suspense fallback={<Loading />}>
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
          { path: '/users', element: <UserListPage /> },
          { path: '/users/add', element: <AddUserPage /> },
          { path: '/users/:userId', element: <UpdateUserPage /> },
          { path: '/operation-logs', element: <OperationLogListPage /> }
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
  createThemeState('system', 'demo-ui-theme')

  return (
    <AuthProvider>
      <VersionProvider>
        <RouterProvider router={router} />

        <Toaster />
      </VersionProvider>
    </AuthProvider>
  )
}
