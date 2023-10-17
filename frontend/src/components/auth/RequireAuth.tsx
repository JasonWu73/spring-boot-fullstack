import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { getAuthFromLocalStorage } from '@/api/dummyjson/auth'
import { debounce } from '@/lib/utils'

type RequireAuthProps = {
  children: React.ReactNode
}

let initialLoadPage = true

const initialFinish = debounce(() => {
  initialLoadPage = false
}, 200)

function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation()
  const [isAuth, setIsAuth] = useState(isLoggedIn)

  useReloadRoute(location.key, setIsAuth)

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

function isLoggedIn() {
  const auth = getAuthFromLocalStorage()
  return !!auth && !!auth.token
}

function useReloadRoute(
  key: string,
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    if (initialLoadPage) {
      initialFinish()
      return
    }

    setIsAuth(isLoggedIn())
  }, [key])
}

export { RequireAuth }
