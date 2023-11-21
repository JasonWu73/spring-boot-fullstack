import React from 'react'

import type { FetchResponse } from '@/shared/hooks/use-fetch'
import {
  CUSTOM_HTTP_STATUS_ERROR_CODE,
  sendRequest,
  type ApiRequest
} from '@/shared/utils/http'
import { encrypt } from '@/shared/utils/rsa'

// 分页参数类型
type PaginationParams = {
  pageNum: number
  pageSize: number
  orderBy?: string
  order?: 'asc' | 'desc'
}

// 分页结果类型
type PaginationData<T> = {
  pageNum: number
  pageSize: number
  total: number
  list: T[]
}

// 可分配的功能权限
const AUTHORITY_OPTIONS = [
  {
    value: 'admin',
    label: '管理员'
  },
  {
    value: 'user',
    label: '普通用户'
  }
]

const PUBLIC_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmWWFyJSaS/SMYr7hmCSXcwAvPF+aGPbbQFOt3rJXjDVKL2GhumWXH2y+dC5/DoaCtDz3dFTyzuoYyiuTHzbpsQ7ari8LoRunOJ81Hx0szpdKbOYJ5WnUr3mr7qEIwY5Verh1dgknNxuzeeTNlmAeLQj067+B+7m9+xp2WU+VSawIDAQAB'

const STORAGE_KEY = 'demo-auth'

// 这里假设 Vite 运行时使用默认的 5173 端口
const DEV_PORT = '5173'
const BACKEND_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8080`

const BASE_URL =
  window.location.port === DEV_PORT ? BACKEND_BASE_URL : window.location.host

// 错误响应数据类型
type ApiError = {
  timestamp: string
  status: number
  error: string
  path: string
}

type AuthResponse = {
  accessToken: string
  refreshToken: string
  expiresInSeconds: number
  nickname: string
  authorities: string[]
}

type Auth = {
  accessToken: string
  refreshToken: string
  nickname: string
  authorities: string[]
  expiresAt: number
}

type AuthProviderState = {
  auth: Auth | null
  isRoot: boolean
  isAdmin: boolean
  isUser: boolean

  login: (username: string, password: string) => Promise<FetchResponse<AuthResponse>>
  logout: () => Promise<FetchResponse<void>>

  requestApi: <T>(request: ApiRequest, type?: string) => Promise<FetchResponse<T>>
}

const AuthProviderContext = React.createContext(undefined as unknown as AuthProviderState)

type AuthProviderProps = {
  children: React.ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = React.useState(getStorageAuth)
  const refreshable = React.useRef(true)

  const isRoot = auth?.authorities.includes('root') ?? false

  const isAdmin = isRoot || (auth?.authorities.includes('admin') ?? false)

  const isUser = isRoot || isAdmin || (auth?.authorities.includes('user') ?? false)

  /**
   * 需要使用访问令牌的 API 请求。
   */
  async function requestApi<T>(request: ApiRequest): Promise<FetchResponse<T>> {
    // 请求无需拥有访问令牌的开放 API
    if (!auth) return requestBackendApi(request)

    // 请求需要访问令牌的 API（涉及自动刷新机制）
    const { expiresAt, accessToken, refreshToken } = auth

    // 这里为了测试目的，故意设置离过期时间有 29 分钟时就刷新访问令牌
    const needsRefreshAuth = expiresAt - Date.now() <= 29 * 60 * 1000

    // 发送请求
    const response = await requestBackendApi<T>({
      ...request,
      headers: { ...request.headers, Authorization: `Bearer ${accessToken}` }
    })

    // 检查是否需要重新登录
    if (response.status === 401) {
      setAuthCache(null)
      return { status: response.status, error: '登录过期' }
    }

    // 检查是否需要刷新访问令牌
    if (needsRefreshAuth && refreshable.current) {
      refreshable.current = false

      const { status, data, error } = await requestBackendApi<AuthResponse>({
        url: `/api/v1/auth/refresh/${refreshToken}`,
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      })

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
    }

    return response
  }

  function setAuthCache(auth: Auth | null) {
    setAuth(auth)
    setStorageAuth(auth)
  }

  const value: AuthProviderState = {
    auth,
    isRoot,
    isAdmin,
    isUser,

    login: async (username, password) => {
      const response = await requestBackendApi<AuthResponse>({
        url: '/api/v1/auth/login',
        method: 'POST',
        bodyData: {
          username: encrypt(PUBLIC_KEY, username),
          password: encrypt(PUBLIC_KEY, password)
        }
      })

      if (response.data) {
        const auth = toStorageAuth(response.data)
        setAuth(auth)
        setStorageAuth(auth)
      }

      return response
    },
    logout: async () => {
      if (!auth) return { status: CUSTOM_HTTP_STATUS_ERROR_CODE, error: '未登录' }

      const response = await requestApi<void>({
        url: '/api/v1/auth/logout',
        method: 'DELETE'
      })

      // 不论后端退出登录是否成功，前端都要退出登录
      setAuth(null)
      setStorageAuth(null)

      return response
    },

    requestApi
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

async function requestBackendApi<T>(request: ApiRequest): Promise<FetchResponse<T>> {
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

export {
  AUTHORITY_OPTIONS,
  AuthProvider,
  useAuth,
  type PaginationData,
  type PaginationParams
}
