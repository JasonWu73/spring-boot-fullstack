import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { LoginLayout } from '@/shared/components/layout/LoginLayout'
import { AdminLayout } from '@/shared/components/layout/AdminLayout'
import ErrorPage from '@/shared/components/ui/ErrorPage'
import NotFoundPage from '@/shared/components/ui/NotFoundPage'
import { SecureRoute } from '@/shared/auth/SecureRoute'

const LoginPage = React.lazy(() => import('@/login/LoginPage'))
const DashboardPage = React.lazy(() => import('@/dashboard/DashboardPage'))
const ProfilePage = React.lazy(() => import('@/user/ProfilePage'))
const UserListPage = React.lazy(() => import('@/user/UserListPage'))
const AddUserPage = React.lazy(() => import('@/user/AddUserPage'))
const UpdateUserPage = React.lazy(() => import('@/user/UpdateUserPage'))
const OpLogListPage = React.lazy(() => import('@/op-log/OpLogListPage'))

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
    element: <AdminLayout/>,
    children: [
      {
        errorElement: <ErrorPage/>,
        children: [
          {
            element: <SecureRoute/>,
            children: [
              { path: '/', element: <DashboardPage/> },
              { path: '/profile', element: <ProfilePage/> },
              { path: '/users', element: <UserListPage/> },
              { path: '/users/add', element: <AddUserPage/> },
              { path: '/users/:userId', element: <UpdateUserPage/> },
              { path: '/op-logs', element: <OpLogListPage/> }
            ]
          }
        ]
      },
      { path: '*', element: <NotFoundPage/> }
    ]
  }
])
