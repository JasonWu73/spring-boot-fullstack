import {lazy, Suspense} from 'react'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'

import {wait} from '@/utils/helpers'
import {SecureRoute} from '@/features/auth/SecureRoute'
import {FriendProvider} from '@/features/eat-split/FriendProvider'
import {Spinner} from '@/ui/Spinner'
import {PanelFoldProvider} from '@/ui/layout/panel-fold/PanelFoldProvider'
import {ThemeProvider} from '@/ui/shadcn-ui/ThemeProvider'
import {AuthProvider} from '@/features/auth/AuthProvider'
import {Toaster} from '@/ui/shadcn-ui/Toaster'
import LoginLayout from '@/ui/layout/LoginLayout'
import MainLayout from '@/ui/layout/MainLayout'
import AdminLayout from '@/ui/layout/AdminLayout'

const Login = lazy(() => import('@/features/auth/Login'))
const ProductShowcase = lazy(() => import('@/features/product-showcase/ProductShowcase'))
const EatAndSplit = lazy(() => import('@/features/eat-split/EatAndSplit'))
const PageNotFound = lazy(() => import('@/ui/PageNotFound'))
const UserList = lazy(() => import('@/features/user/UserList'))
const ChildrenProp = lazy(() => import('@/features/performance/ChildrenProp'))
const MemoComponent = lazy(() => import('@/features/performance/MemoComponent'))
const UseMemo = lazy(() => import('@/features/performance/UseMemo'))
const UseCallback = lazy(() => import('@/features/performance/UseCallback'))

// ----- 开始：测试 React Router 懒加载（React Split Code）-----
const FormSplitBill = lazy(() =>
  wait(2).then(() =>
    import('@/features/eat-split/FormSplitBill').then((module) => ({
      default: module.FormSplitBill
    }))
  )
)
// ----- 结束：测试 React Router 懒加载（React Split Code）-----

const router = createBrowserRouter([
  {
    element: <LoginLayout/>,
    children: [{path: '/login', element: <Login/>}]
  },
  {
    element: <MainLayout/>,
    children: [
      {path: '/', element: <Navigate to="/eat-split" replace/>},
      {
        element: <SecureRoute/>,
        children: [{path: '/fetch', element: <ProductShowcase/>}]
      },
      {
        path: '/eat-split',
        element: <FriendProvider><EatAndSplit/></FriendProvider>,
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
      {path: '*', element: <PageNotFound/>}
    ]
  },
  {
    element: <PanelFoldProvider><AdminLayout/></PanelFoldProvider>,
    children: [
      {
        element: <SecureRoute/>,
        children: [
          {path: '/admin', element: <Navigate to="/users" replace/>},
          {path: '/users', element: <UserList/>},
          {path: '/children', element: <ChildrenProp/>},
          {path: '/memo', element: <MemoComponent/>},
          {path: '/use-memo', element: <UseMemo/>},
          {path: '/use-callback', element: <UseCallback/>}
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
