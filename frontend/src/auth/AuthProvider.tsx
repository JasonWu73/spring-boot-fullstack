import React from 'react'

import { loginApi } from '@/shared/apis/backend/auth-api'
import type { LoginParams } from '@/shared/apis/backend/types'
import type { AbortFetch, Auth } from '@/shared/hooks/types'
import { useFetch } from '@/shared/hooks/use-fetch'
import { encrypt } from '@/shared/utils/rsa'

const PUBLIC_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmWWFyJSaS/SMYr7hmCSXcwAvPF+aGPbbQFOt3rJXjDVKL2GhumWXH2y+dC5/DoaCtDz3dFTyzuoYyiuTHzbpsQ7ari8LoRunOJ81Hx0szpdKbOYJ5WnUr3mr7qEIwY5Verh1dgknNxuzeeTNlmAeLQj067+B+7m9+xp2WU+VSawIDAQAB'

const STORAGE_KEY = 'demo-auth'

type AuthProviderState = {
  auth: Auth | null
  error: string
  loading: boolean
  login: (username: string, password: string) => AbortFetch
  logout: () => void
  refreshAuth: (auth: Auth) => void
}

const initialState: AuthProviderState = {
  auth: null,
  error: '',
  loading: false,
  login: () => () => null,
  logout: () => null,
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
    error,
    loading,
    fetchData: Login
  } = useFetch<Auth, LoginParams>(async (payload, params) => {
    const response = await loginApi(payload, {
      username: encrypt(PUBLIC_KEY, params!.username),
      password: encrypt(PUBLIC_KEY, params!.password)
    })

    if (response.data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data))
      setAuth(response.data)
    }

    return response
  })

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setAuth(null)
  }

  function refreshAuth(auth: Auth) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
    setAuth(auth)
  }

  const value: AuthProviderState = {
    auth,
    error,
    loading,
    login: (username, password) => Login({ username, password }),
    logout,
    refreshAuth
  }

  return (
    <AuthProviderContext.Provider value={value}>{children}</AuthProviderContext.Provider>
  )
}

function useAuth() {
  return React.useContext(AuthProviderContext)
}

export { AuthProvider, useAuth }
