import React from 'react'

import type { Auth } from '@/auth/types'
import { BASE_URL } from '@/shared/apis/backend/constants'
import type { ApiError } from '@/shared/apis/backend/types'
import type { FetchResponse } from '@/shared/hooks/types'
import { CUSTOM_HTTP_STATUS_ERROR_CODE, sendRequest } from '@/shared/utils/http'
import { encrypt } from '@/shared/utils/rsa'
import type { ApiRequest } from '@/shared/utils/types'

const PUBLIC_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmWWFyJSaS/SMYr7hmCSXcwAvPF+aGPbbQFOt3rJXjDVKL2GhumWXH2y+dC5/DoaCtDz3dFTyzuoYyiuTHzbpsQ7ari8LoRunOJ81Hx0szpdKbOYJ5WnUr3mr7qEIwY5Verh1dgknNxuzeeTNlmAeLQj067+B+7m9+xp2WU+VSawIDAQAB'

const STORAGE_KEY = 'demo-auth'

type AuthResponse = {
  accessToken: string
  refreshToken: string
  expiresInSeconds: number
  nickname: string
  authorities: string[]
}

type AuthProviderState = {
  auth: Auth | null
  loading: boolean

  login: (username: string, password: string) => Promise<FetchResponse<AuthResponse>>

  logout: () => Promise<FetchResponse<void>>

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
  const [loading, setLoading] = React.useState(false)
  const refreshable = React.useRef(true)

  /**
   * 需要使用访问令牌的 API 请求。
   */
  async function requestApi<T>(request: ApiRequest): Promise<FetchResponse<T>> {
    // 请求无需拥有访问令牌的开放 API
    if (!auth) {
      return requestPublicApi(request)
    }

    // 请求需要访问令牌的 API（涉及自动刷新机制）
    const { expiresAt, accessToken, refreshToken } = auth

    // 这里为了测试目的，故意设置离过期时间有 29 分钟时就刷新访问令牌
    const needsRefreshAuth = expiresAt - Date.now() <= 29 * 60 * 1000

    setLoading(true)

    // 发送请求
    const response = await requestPrivateApi<T>({
      ...request,
      headers: { ...request.headers, Authorization: `Bearer ${accessToken}` }
    })

    // 检查是否需要重新登录
    if (response.status === 401) {
      setLoading(false)
      setAuthCache(null)
      return { status: response.status, error: '登录过期' }
    }

    // 检查是否需要刷新访问令牌
    if (needsRefreshAuth && refreshable.current) {
      refreshable.current = false

      const { status, data, error } = await requestPrivateApi<AuthResponse>({
        url: `/api/v1/auth/refresh/${refreshToken}`,
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      setLoading(false)

      if (error) {
        setAuthCache(null)
        return { status, error: error }
      }

      if (data) {
        const auth = toStorageAuth(data)
        setAuthCache(auth)
      }

      // 刷新访问令牌后，至少间隔 10 分钟后才能再次触发
      // 主要为了防止 `React.StrictMode` 模式下执行两次刷新，导致退出登录
      setTimeout(() => {
        refreshable.current = true
      }, 600_000)
    } else {
      setLoading(false)
    }

    return response
  }

  function setAuthCache(auth: Auth | null) {
    setAuth(auth)
    setStorageAuth(auth)
  }

  const isRoot = auth?.authorities.includes('root') ?? false

  const isAdmin = isRoot || (auth?.authorities.includes('admin') ?? false)

  const isUser = isRoot || isAdmin || (auth?.authorities.includes('user') ?? false)

  const value: AuthProviderState = {
    auth,
    loading,
    login: async (username, password) => {
      setLoading(true)

      const response = await requestPublicApi<AuthResponse>({
        url: '/api/v1/auth/login',
        method: 'POST',
        bodyData: {
          username: encrypt(PUBLIC_KEY, username),
          password: encrypt(PUBLIC_KEY, password)
        }
      })

      setLoading(false)

      if (response.data) {
        const auth = toStorageAuth(response.data)
        setAuth(auth)
        setStorageAuth(auth)
      }

      return response
    },

    logout: async () => {
      if (!auth) return { status: CUSTOM_HTTP_STATUS_ERROR_CODE, error: '未登录' }

      setLoading(true)

      const response = await requestApi<void>({
        url: '/api/v1/auth/logout',
        method: 'DELETE'
      })

      setLoading(false)

      // 不论后端退出登录是否成功，前端都要退出登录
      setAuth(null)
      setStorageAuth(null)

      return response
    },

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

/**
 * 不需要访问令牌的 API 请求。
 */
async function requestPublicApi<T>(request: ApiRequest): Promise<FetchResponse<T>> {
  const { status, data, error } = await sendRequest<T, ApiError>({
    ...request,
    url: `${BASE_URL}${request.url}`
  })

  if (error) {
    if (typeof error === 'string') return { status, error }

    return { status, error: error.error }
  }

  return { status, data: data ?? undefined }
}

/**
 * 需要访问令牌的 API 请求。
 */
async function requestPrivateApi<T>(request: ApiRequest): Promise<FetchResponse<T>> {
  const { status, data, error } = await sendRequest<T, ApiError>({
    ...request,
    url: `${BASE_URL}${request.url}`
  })

  if (error) {
    if (typeof error === 'string') return { status, error }

    return { status, error: error.error }
  }

  return { status, data: data ?? undefined }
}

export { AuthProvider, useAuth }
