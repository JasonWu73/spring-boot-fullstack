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
  const { loggedIn } = useRefreshLogin()

  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

function isLoggedIn() {
  const auth = getAuthFromLocalStorage()
  return !!auth && !!auth.token
}

function useRefreshLogin() {
  const location = useLocation()
  const [loggedIn, setLoggedIn] = useState(isLoggedIn)

  useEffect(() => {
    if (initialLoadPage) {
      initialFinish()
      return
    }

    setLoggedIn(isLoggedIn())
  }, [location.key])

  return { loggedIn }
}

export { RequireAuth, useRefreshLogin }
