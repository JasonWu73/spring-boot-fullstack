import React from 'react'

import type { Auth } from '@/auth/types'
import { loginApi, refreshApi } from '@/shared/apis/backend/auth-api'
import { BASE_URL } from '@/shared/apis/backend/constants'
import type {
  ApiError,
  Auth as AuthResponse,
  LoginParams
} from '@/shared/apis/backend/types'
import type { FetchResponse, IgnoreFetch } from '@/shared/hooks/types'
import { useFetch } from '@/shared/hooks/use-fetch'
import { sendRequest } from '@/shared/utils/http'
import { encrypt } from '@/shared/utils/rsa'
import type { ApiRequest } from '@/shared/utils/types'

const PUBLIC_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmWWFyJSaS/SMYr7hmCSXcwAvPF+aGPbbQFOt3rJXjDVKL2GhumWXH2y+dC5/DoaCtDz3dFTyzuoYyiuTHzbpsQ7ari8LoRunOJ81Hx0szpdKbOYJ5WnUr3mr7qEIwY5Verh1dgknNxuzeeTNlmAeLQj067+B+7m9+xp2WU+VSawIDAQAB'

const STORAGE_KEY = 'demo-auth'

type AuthProviderState = {
  auth: Auth | null
  loginError: string
  loginLoading: boolean
  login: (username: string, password: string) => IgnoreFetch

  logoutError: string
  logoutLoading: boolean
  logout: () => IgnoreFetch

  requestApi: <T>(request: ApiRequest) => Promise<FetchResponse<T>>

  isRoot: boolean
  isAdmin: boolean
  isUser: boolean
}

const AuthProviderContext = React.createContext(undefined as unknown as AuthProviderState)

type AuthProviderProps = {
  children: React.ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = React.useState(getStorageAuth)

  const {
    error: loginError,
    loading: loginLoading,
    fetchData: login
  } = useFetch(async (params?: LoginParams) => {
    if (!params) return { error: '参数缺失' }

    const response = await loginApi({
      username: encrypt(PUBLIC_KEY, params.username),
      password: encrypt(PUBLIC_KEY, params.password)
    })

    const { data, error } = response

    if (error) return response

    if (data) {
      const auth = toStorageAuth(data)

      setAuth(auth)
      setStorageAuth(auth)
    }

    return response
  })

  const {
    error: logoutError,
    loading: logoutLoading,
    fetchData: logout
  } = useFetch(async () => {
    // 不论后端退出登录是否成功，前端都要退出登录
    setAuth(null)
    setStorageAuth(null)

    if (!auth) return { error: '未登录' }

    await requestApi({
      url: '/api/v1/auth/logout',
      method: 'DELETE'
    })

    return {}
  })

  async function requestApi<T>(request: ApiRequest): Promise<FetchResponse<T>> {
    if (!auth) return { error: '未登录' }

    const { expiresAt, accessToken, refreshToken } = auth

    // 发送请求
    const response = await sendRequest<T, ApiError>({
      ...request,
      url: `${BASE_URL}${request.url}`,
      headers: { ...request.headers, Authorization: `Bearer ${accessToken}` }
    })

    // 检查是否需要刷新访问令牌
    // 这里为了测试目的，故意设置离过期时间有 29 分钟时就刷新访问令牌
    if (expiresAt - Date.now() <= 29 * 60 * 1000) {
      const { data, error } = await refreshApi(accessToken, refreshToken)

      if (error) {
        setStorageAuth(null)
      }

      if (data) {
        const auth = toStorageAuth(data)

        setAuth(auth)
        setStorageAuth(auth)
      }
    }

    const { data, error } = response

    if (error) {
      if (typeof error === 'string') return { error }

      return { error: error.error }
    }

    return { data: data ?? undefined }
  }

  const isRoot = auth?.authorities.includes('root') ?? false

  const isAdmin = isRoot || (auth?.authorities.includes('admin') ?? false)

  const isUser = isRoot || isAdmin || (auth?.authorities.includes('user') ?? false)

  const value: AuthProviderState = {
    auth,
    loginError,
    loginLoading,
    login: (username, password) => login({ username, password }),

    logoutError,
    logoutLoading,
    logout,

    requestApi,

    isRoot,
    isAdmin,
    isUser
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

function getStorageAuth(): Auth | null {
  const storageAuth = localStorage.getItem(STORAGE_KEY)

  if (!storageAuth) return null

  return JSON.parse(storageAuth)
}

function setStorageAuth(auth: Auth | null) {
  if (auth) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
    return
  }

  localStorage.removeItem(STORAGE_KEY)
}

function toStorageAuth(data: AuthResponse) {
  const auth: Auth = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    nickname: data.nickname,
    authorities: data.authorities,
    expiresAt: Date.now() + data.expiresInSeconds * 1000
  }

  return auth
}

export { AuthProvider, useAuth }
