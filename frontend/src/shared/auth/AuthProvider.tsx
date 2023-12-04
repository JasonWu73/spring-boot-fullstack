import React from 'react'

import { ADMIN, ROOT, USER } from '@/shared/auth/constants'
import type { ApiResponse } from '@/shared/hooks/use-api'
import { sendRequest, type ApiRequest } from '@/shared/utils/api-caller'

/**
 * 用户名和密码的加密公钥。
 */
export const PUBLIC_KEY =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArbGWjwR4QAjBiJwMi5QNe+X8oPEFBfX3z5K6dSv9tU2kF9SVkf8uGGJwXeihQQ0o9aUk42zO58VL3MqDOaWHU6wm52pN9ZBbH0XJefqxtgyXrYAm279MU6EY4sywkUT9KOOgk/qDHB93IoEDL1fosYc7TRsAONuMGiyTJojn1FCPtJbbj7J56yCaFhUpuDunBFETQ32usRaK4KCWx9w0HZ6WmbX8QdcJkVjJ2FCLuGkvbKmUQ5h/GXXnNgbxIn3z2lX7snGRMhIFvW0Qjkn8YmOq6HUj7TU0jKm9VhZirVQXh8trvi2ivY7s6yJoF8N72Ekn94WSpSRVeC0XpXf2LQIDAQAB'

const STORAGE_KEY = 'demo-auth'

// 这里假设 Vite 运行时使用默认的 5173 端口
const DEV_PORT = '5173'
const DEV_BACKEND_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8080`
const PROD_BACKEND_BASE_URL = `${window.location.origin}`

const BASE_URL =
  window.location.port === DEV_PORT ? DEV_BACKEND_BASE_URL : PROD_BACKEND_BASE_URL

/**
 * 后端 API 在请求失败时返回的错误数据类型。
 */
type ApiError = {
  timestamp: string
  status: number
  error: string
  path: string
}

/**
 * 后端返回的身份验证数据类型。
 */
export type AuthResponse = {
  accessToken: string
  refreshToken: string
  expiresInSeconds: number
  nickname: string
  authorities: string[]
}

/**
 * 前端存储的身份验证数据类型。
 */
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

  requestApi: <T>(request: ApiRequest) => Promise<ApiResponse<T>>
}

const AuthProviderContext = React.createContext(undefined as unknown as AuthProviderState)

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = React.useState(getStorageAuth)
  const refreshedAtRef = React.useRef<number>(0)

  const isRoot = auth?.authorities.includes(ROOT.value) ?? false
  const isAdmin = isRoot || (auth?.authorities.includes(ADMIN.value) ?? false)
  const isUser = isRoot || isAdmin || (auth?.authorities.includes(USER.value) ?? false)

  /**
   * 发送 API 请求。
   * <p>
   * 使用此方法发送请求，会自动处理以下情况：
   *
   * <ul>
   *   <li>当访问令牌存在时，会自动添加到请求头中</li>
   *   <li>当访问令牌快过期时，会自动刷新访问令牌</li>
   *   <li>当访问令牌过期时，会自动退出登录</li>
   * </ul>
   *
   * @param request
   */
  async function requestApi<T>(request: ApiRequest): Promise<ApiResponse<T>> {
    if (!auth) return await requestBackendApi<T>(request)

    const { expiresAt, accessToken } = auth

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

    // 防止在一个页面同时发起多个 API 请求时，即多次触发刷新，而导致身份验证失败（因为 JS 闭包读取了旧数据）
    // 故设置 1 分钟内只允许刷新一次
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

    deleteAuth: () => {
      // 前端退出登录
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

export function useAuth(): AuthProviderState {
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

async function requestBackendApi<T>(request: ApiRequest): Promise<ApiResponse<T>> {
  const baseUrl = /^https?:\/\/.+/.test(request.url) ? request.url : BASE_URL

  const { status, data, error } = await sendRequest<T, ApiError>({
    ...request,
    url: `${baseUrl}${request.url}`
  })

  if (error) {
    return { status, error: typeof error === 'string' ? error : error.error }
  }

  return { status, data }
}
