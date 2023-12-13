import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'

import { SecureRoute } from '@/shared/auth/SecureRoute'
import { AdminLayout } from '@/shared/components/layout/AdminLayout'
import { LoginLayout } from '@/shared/components/layout/LoginLayout'
import { MainLayout } from '@/shared/components/layout/MainLayout'
import { Loading } from '@/shared/components/ui/Loading'
import { Toaster } from '@/shared/components/ui/Toaster'
import { createAuthState } from '@/shared/signals/auth'
import { createPanelFoldState } from '@/shared/signals/panel-fold'
import { createThemeState } from '@/shared/signals/theme'
import { createVersionState } from '@/shared/signals/version'
import { wait } from '@/shared/utils/helpers'

const ErrorPage = React.lazy(() => import('@/shared/components/ui/ErrorPage'))
const NotFoundPage = React.lazy(() => import('@/shared/components/ui/NotFoundPage'))
const ForbiddenPage = React.lazy(() => import('@/shared/components/ui/ForbiddenPage'))
const LoginPage = React.lazy(() => import('@/login/LoginPage'))
const DashboardPage = React.lazy(() => import('@/dashboard/DashboardPage'))
const ProfilePage = React.lazy(() => import('@/user/ProfilePage'))
const RandomProductPage = React.lazy(() => import('@/product/RandomProductPage'))
const SplitBillPage = React.lazy(() => import('@/split-bill/SplitBillPage'))
const UserListPage = React.lazy(() => import('@/user/UserListPage'))
const AddUserPage = React.lazy(() => import('@/user/AddUserPage'))
const UpdateUserPage = React.lazy(() => import('@/user/UpdateUserPage'))
const OperationLogListPage = React.lazy(
  () => import('@/operation-log/OperationLogListPage')
)

// 测试 React 懒加载非 `default` 导出的组件
const SplitBill = React.lazy(() =>
  wait(2).then(() =>
    import('@/split-bill/SplitBill').then((module) => ({
      default: module.SplitBill
    }))
  )
)

const router = createBrowserRouter([
  {
    element: <LoginLayout />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [{ path: '/login', element: <LoginPage /> }]
      }
    ]
  },

  {
    element: <MainLayout />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
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
            element: <SplitBillPage />,
            children: [
              {
                path: ':friendId',
                element: (
                  <React.Suspense fallback={<Loading />}>
                    <SplitBill />
                  </React.Suspense>
                )
              }
            ]
          }
        ]
      },
      { path: '/403', element: <ForbiddenPage /> },
      { path: '*', element: <NotFoundPage /> }
    ]
  },

  {
    element: <AdminLayout />,
    children: [
      {
        errorElement: <ErrorPage />,
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
    ]
  }
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000
    }
  }
})

// 创建组件外 Signal
createThemeState('system', 'demo-ui-theme')
createAuthState()
createPanelFoldState()
createVersionState().then()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      <Toaster />
    </QueryClientProvider>
  )
}
