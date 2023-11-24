import React from 'react'

import type { FetchResponse } from '@/shared/hooks/use-fetch'
import { sendRequest, type ApiRequest } from '@/shared/utils/http'

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

type Authority = 'root' | 'admin' | 'user'

type AuthorityOption = {
  value: Authority
  label: string
}

// 可分配的功能权限，其中 `root` 权限不可手动分配
const ROOT: AuthorityOption = { value: 'root', label: '超级管理员' }
const ADMIN: AuthorityOption = { value: 'admin', label: '管理员' }
const USER: AuthorityOption = { value: 'user', label: '用户' }

const PUBLIC_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmWWFyJSaS/SMYr7hmCSXcwAvPF+aGPbbQFOt3rJXjDVKL2GhumWXH2y+dC5/DoaCtDz3dFTyzuoYyiuTHzbpsQ7ari8LoRunOJ81Hx0szpdKbOYJ5WnUr3mr7qEIwY5Verh1dgknNxuzeeTNlmAeLQj067+B+7m9+xp2WU+VSawIDAQAB'

const STORAGE_KEY = 'demo-auth'

// 这里假设 Vite 运行时使用默认的 5173 端口
const DEV_PORT = '5173'
const DEV_BACKEND_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8080`
const PROD_BACKEND_BASE_URL = `${window.location.origin}`

const BASE_URL =
  window.location.port === DEV_PORT ? DEV_BACKEND_BASE_URL : PROD_BACKEND_BASE_URL

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

  setAuth: (data: AuthResponse) => void
  deleteAuth: () => void

  requestApi: <T>(request: ApiRequest, type?: string) => Promise<FetchResponse<T>>
}

const AuthProviderContext = React.createContext(undefined as unknown as AuthProviderState)

type AuthProviderProps = {
  children: React.ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = React.useState(getStorageAuth)

  const isRoot = auth?.authorities.includes(ROOT.value) ?? false
  const isAdmin = isRoot || (auth?.authorities.includes(ADMIN.value) ?? false)
  const isUser = isRoot || isAdmin || (auth?.authorities.includes(USER.value) ?? false)

  /**
   * 需要使用访问令牌的 API 请求。
   */
  async function requestApi<T>(request: ApiRequest): Promise<FetchResponse<T>> {
    // 请求无需拥有访问令牌的开放 API
    if (!auth) return await requestBackendApi<T>(request)

    // 请求需要访问令牌的 API（涉及自动刷新机制）
    const { expiresAt, accessToken, refreshToken } = auth

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
    // 这里为了测试目的，故意设置离过期时间小于 29 分时就刷新访问令牌
    if (expiresAt - Date.now() < 29 * 60 * 1000) {
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

    setAuth: (data: AuthResponse) => {
      const auth = toStorageAuth(data)

      setAuthCache(auth)
    },
    deleteAuth: async () => {
      // 不论后端退出登录是否成功，前端都要退出登录
      setAuthCache(null)
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
  if (!auth) {
    localStorage.removeItem(STORAGE_KEY)

    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

function toStorageAuth(data: AuthResponse): Auth {
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    nickname: data.nickname,
    authorities: data.authorities,
    expiresAt: Date.now() + data.expiresInSeconds * 1000
  }
}

async function requestBackendApi<T>(request: ApiRequest): Promise<FetchResponse<T>> {
  const baseUrl = /^https?:\/\/.+/.test(request.url) ? request.url : BASE_URL

  const { status, data, error } = await sendRequest<T, ApiError>({
    ...request,
    url: `${baseUrl}${request.url}`
  })

  if (error) {
    if (typeof error === 'string') return { status, error }

    return { status, error: error.error }
  }

  return { status, data }
}

export {
  ADMIN,
  AuthProvider,
  PUBLIC_KEY,
  ROOT,
  USER,
  useAuth,
  type AuthResponse,
  type Authority,
  type PaginationData,
  type PaginationParams
}
