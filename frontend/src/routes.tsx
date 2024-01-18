import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { MainLayout } from '@/shared/components/layout/MainLayout'
import { LoginLayout } from '@/shared/components/layout/LoginLayout'
import { AdminLayout } from '@/shared/components/layout/AdminLayout'
import ErrorPage from '@/shared/components/ui/ErrorPage'
import NotFoundPage from '@/shared/components/ui/NotFoundPage'
import { Loading } from '@/shared/components/ui/Loading'
import { SecureRoute } from '@/shared/auth/SecureRoute'
import { wait } from '@/shared/utils/helpers'

const DashboardPage = React.lazy(() => import('@/dashboard/DashboardPage'))
const LoginPage = React.lazy(() => import('@/login/LoginPage'))
const ProfilePage = React.lazy(() => import('@/user/ProfilePage'))
const RandomProductPage = React.lazy(() => import('@/product/RandomProductPage'))
const SplitBillPage = React.lazy(() => import('@/split-bill/SplitBillPage'))
const UserListPage = React.lazy(() => import('@/user/UserListPage'))
const AddUserPage = React.lazy(() => import('@/user/AddUserPage'))
const UpdateUserPage = React.lazy(() => import('@/user/UpdateUserPage'))
const OpLogListPage = React.lazy(() => import('@/op-log/OpLogListPage'))
const CounterPage = React.lazy(() => import('@/compound-component/CounterPage'))

// 测试 React 懒加载非 `default` 导出的组件
const SplitBill = React.lazy(() => wait(2).then(() => (
  import('@/split-bill/SplitBill').then((module) => ({
    default: module.SplitBill
  })))
))

export const router = createBrowserRouter([
  {
    element: <LoginLayout/>,
    children: [
      {
        errorElement: <ErrorPage/>,
        children: [{ path: '/login', element: <LoginPage/> }]
      }
    ]
  },

  {
    element: <MainLayout/>,
    children: [
      {
        errorElement: <ErrorPage/>,
        children: [
          { path: '/', element: <DashboardPage/> },
          {
            element: <SecureRoute/>,
            children: [{ path: '/profile', element: <ProfilePage/> }]
          },
          {
            element: <SecureRoute authority="user"/>,
            children: [
              { path: '/compound-component', element: <CounterPage/> }
            ]
          },
          {
            path: '/split-bill',
            element: <SplitBillPage/>,
            children: [
              {
                path: ':friendId',
                element: (
                  <React.Suspense fallback={<Loading/>}>
                    <SplitBill/>
                  </React.Suspense>
                )
              }
            ]
          }
        ]
      },
      { path: '*', element: <NotFoundPage/> }
    ]
  },

  {
    element: <SecureRoute authority="admin"/>,
    children: [
      {
        element: <AdminLayout/>,
        children: [
          {
            errorElement: <ErrorPage/>,
            children: [
              { path: '/admin', element: <Navigate to="/users" replace/> },
              { path: '/users', element: <UserListPage/> },
              { path: '/users/add', element: <AddUserPage/> },
              { path: '/users/:userId', element: <UpdateUserPage/> },
              { path: '/op-logs', element: <OpLogListPage/> },
              {
                element: <SecureRoute authority="root"/>,
                children: [
                  { path: '/product', element: <RandomProductPage/> }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
])
