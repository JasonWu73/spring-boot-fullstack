import React from 'react'

import { loginApi, logoutApi } from '@/shared/apis/backend/auth-api'
import type { LoginParams } from '@/shared/apis/backend/types'
import type { Auth } from '@/shared/hooks/types'
import { useFetch } from '@/shared/hooks/use-fetch'
import { encrypt } from '@/shared/utils/rsa'

const PUBLIC_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmWWFyJSaS/SMYr7hmCSXcwAvPF+aGPbbQFOt3rJXjDVKL2GhumWXH2y+dC5/DoaCtDz3dFTyzuoYyiuTHzbpsQ7ari8LoRunOJ81Hx0szpdKbOYJ5WnUr3mr7qEIwY5Verh1dgknNxuzeeTNlmAeLQj067+B+7m9+xp2WU+VSawIDAQAB'

const STORAGE_KEY = 'demo-auth'

type IsOK =
  | {
      success: true
    }
  | {
      success: false
      error: string
    }

type AuthProviderState = {
  auth: Auth | null
  loginError: string
  loginLoading: boolean
  login: (username: string, password: string, abortSignal?: AbortSignal) => Promise<IsOK>

  logoutLoading: boolean
  logout: () => Promise<IsOK>
  deleteLoginCache: () => void

  refreshAuth: (auth: Auth) => void
}

const initialState: AuthProviderState = {
  auth: null,
  loginError: '',
  loginLoading: false,
  login: () => Promise.resolve({ success: true }),

  logoutLoading: false,
  logout: () => Promise.resolve({ success: true }),
  deleteLoginCache: () => null,

  refreshAuth: () => null
}

const AuthProviderContext = React.createContext(initialState)

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
    if (!params) return { data: null, error: '参数错误' }

    const response = await loginApi({
      username: encrypt(PUBLIC_KEY, params.username),
      password: encrypt(PUBLIC_KEY, params.password),
      abortSignal: params.abortSignal
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
    login: async (username, password, abortSignal) => {
      const { data, error } = await login({ username, password, abortSignal })

      if (data) return { success: true }

      return { success: false, error }
    },

    logoutLoading,
    logout: async () => {
      const { error } = await logout(auth!)

      if (!error) return { success: true }

      return { success: false, error }
    },
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
  return React.useContext(AuthProviderContext)
}

export { AuthProvider, useAuth }
