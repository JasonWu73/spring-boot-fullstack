import React from 'react'

import { loginApi, logoutApi } from '@/shared/apis/backend/auth-api'
import type { LoginParams } from '@/shared/apis/backend/types'
import type { Auth, IgnoreFetch } from '@/shared/hooks/types'
import { useFetch } from '@/shared/hooks/use-fetch'
import { encrypt } from '@/shared/utils/rsa'

const PUBLIC_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmWWFyJSaS/SMYr7hmCSXcwAvPF+aGPbbQFOt3rJXjDVKL2GhumWXH2y+dC5/DoaCtDz3dFTyzuoYyiuTHzbpsQ7ari8LoRunOJ81Hx0szpdKbOYJ5WnUr3mr7qEIwY5Verh1dgknNxuzeeTNlmAeLQj067+B+7m9+xp2WU+VSawIDAQAB'

const STORAGE_KEY = 'demo-auth'

type AuthProviderState = {
  auth: Auth | null
  loginError: string
  loginLoading: boolean
  login: (username: string, password: string) => IgnoreFetch

  logoutLoading: boolean
  logout: () => IgnoreFetch
  deleteLoginCache: () => void

  refreshAuth: (auth: Auth) => void
}

const AuthProviderContext = React.createContext(undefined as unknown as AuthProviderState)

type AuthProviderProps = {
  children: React.ReactNode
}

function createInitialAuthState(): Auth | null {
  const storageAuth = localStorage.getItem(STORAGE_KEY)
  if (!storageAuth) return null

  return JSON.parse(storageAuth)
}

function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = React.useState(createInitialAuthState)

  const {
    error: loginError,
    loading: loginLoading,
    fetchData: login
  } = useFetch(async (params?: LoginParams) => {
    if (!params) return { data: null, error: '参数缺失' }

    const response = await loginApi({
      username: encrypt(PUBLIC_KEY, params.username),
      password: encrypt(PUBLIC_KEY, params.password)
    })

    const { data } = response

    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setAuth(data)
    }

    return response
  })

  const { loading: logoutLoading, fetchData: logout } = useFetch(async (auth?: Auth) => {
    if (!auth) return { data: null, error: '未登录' }

    const response = await logoutApi(auth)

    if (!response.error) {
      deleteLoginCache()
    }

    return response
  })

  function deleteLoginCache() {
    localStorage.removeItem(STORAGE_KEY)
    setAuth(null)
  }

  const value: AuthProviderState = {
    auth,
    loginError,
    loginLoading,
    login: (username, password) => login({ username, password }),

    logoutLoading,
    logout: () => logout(auth!),
    deleteLoginCache,

    refreshAuth: (auth) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
      setAuth(auth)
    }
  }

  return (
    <AuthProviderContext.Provider value={value}>{children}</AuthProviderContext.Provider>
  )
}

function useAuth() {
  const context = React.useContext(AuthProviderContext)
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 中使用')
  }
  return context
}

export { AuthProvider, useAuth }
