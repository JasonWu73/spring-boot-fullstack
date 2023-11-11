import {lazy, Suspense} from 'react'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'

import {wait} from '@/utils/helpers'
import {SecureRoute} from '@/features/auth/SecureRoute'
import {FriendProvider} from '@/features/split-bill/FriendProvider'
import {Spinner} from '@/ui/Spinner'
import {PanelFoldProvider} from '@/ui/layout/panel-fold/PanelFoldProvider'
import {ThemeProvider} from '@/ui/shadcn-ui/ThemeProvider'
import {AuthProvider} from '@/features/auth/AuthProvider'
import {Toaster} from '@/ui/shadcn-ui/Toaster'
import LoginLayout from '@/ui/layout/LoginLayout'
import MainLayout from '@/ui/layout/MainLayout'
import AdminLayout from '@/ui/layout/AdminLayout'

const LoginPage = lazy(() => import('@/features/auth/LoginPage'))
const ProductPage = lazy(() => import('@/features/product/ProductPage'))
const SplitBillPage = lazy(() => import('@/features/split-bill/SplitBillPage'))
const NotFoundPage = lazy(() => import('@/ui/NotFoundPage'))
const UserListPage = lazy(() => import('@/features/user/UserListPage'))

// ----- 开始：测试 React Router 懒加载（React Split Code）-----
const FormSplitBill = lazy(() =>
  wait(2).then(() =>
    import('@/features/split-bill/SplitBillForm').then((module) => ({
      default: module.SplitBillForm
    }))
  )
)
// ----- 结束：测试 React Router 懒加载（React Split Code）-----

const router = createBrowserRouter([
  {
    element: <LoginLayout/>,
    children: [{path: '/login', element: <LoginPage/>}]
  },
  {
    element: <MainLayout/>,
    children: [
      {path: '/', element: <Navigate to="/split-bill" replace/>},
      {
        element: <SecureRoute/>,
        children: [{path: '/fetch', element: <ProductPage/>}]
      },
      {
        path: '/split-bill',
        element: <FriendProvider><SplitBillPage/></FriendProvider>,
        children: [
          {
            path: ':friendId',
            element: (
              <Suspense fallback={<Spinner/>}>
                <FormSplitBill/>
              </Suspense>
            )
          }
        ]
      },
      {path: '*', element: <NotFoundPage/>}
    ]
  },
  {
    element: <PanelFoldProvider><AdminLayout/></PanelFoldProvider>,
    children: [
      {
        element: <SecureRoute/>,
        children: [
          {path: '/admin', element: <Navigate to="/users" replace/>},
          {path: '/users', element: <UserListPage/>},
          {path: '/product', element: <ProductPage/>}
        ]
      }
    ]
  }
])

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="demo-ui-theme">
      <AuthProvider>
        <RouterProvider router={router}/>
        <Toaster/>
      </AuthProvider>
    </ThemeProvider>
  )
}
