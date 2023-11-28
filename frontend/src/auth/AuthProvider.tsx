import React from 'react'

import type { FetchResponse } from '@/shared/hooks/use-fetch'
import { sendRequest, type ApiRequest } from '@/shared/utils/http'

// 分页参数类型
type PaginationParams = {
  pageNum: number
  pageSize: number
  sortColumn?: string
  sortOrder?: 'asc' | 'desc'
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
  updateAuth: (callback: (prevAuth: Auth) => Auth) => void

  requestApi: <T>(request: ApiRequest, type?: string) => Promise<FetchResponse<T>>
}

const AuthProviderContext = React.createContext(undefined as unknown as AuthProviderState)

type AuthProviderProps = {
  children: React.ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = React.useState(getStorageAuth)
  const refreshedAtRef = React.useRef<number>(0)

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
    const { expiresAt, accessToken } = auth

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
    // 这里为了测试目的，故意设置离过期时间小于 29 分时就刷新访问令牌，即 1 分钟后刷新
    if (expiresAt - Date.now() < 29 * 60 * 1000) {
      await refreshAuth()
    }

    return response
  }

  async function refreshAuth() {
    if (!auth) return

    // 防止因同时发起多个请求，从而触发了多次刷新，从而因读取了旧令牌而导致身份验证失败
    // 1 分钟内只允许刷新一次
    if (Date.now() - refreshedAtRef.current < 60 * 1000) return

    refreshedAtRef.current = Date.now()

    const { data, error } = await requestBackendApi<AuthResponse>({
      url: `/api/v1/auth/refresh/${auth.refreshToken}`,
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.accessToken}` }
    })

    if (error) {
      setAuthCache(null)

      return
    }

    if (data) {
      const auth = toStorageAuth(data)

      setAuthCache(auth)
    }
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
    updateAuth: (callback) => {
      if (auth == null) return

      const newAuth = callback(auth)

      setAuthCache(newAuth)
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
  ROOT,
  USER,
  useAuth,
  type AuthResponse,
  type Authority,
  type PaginationData,
  type PaginationParams
}
