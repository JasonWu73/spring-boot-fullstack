import { AuthResponse, clearAuth, getAuth, setAuth } from '@/shared/signals/auth'
import { sendRequest, type ApiRequest } from '@/shared/utils/api-caller'

// 这里假设 Vite 运行时使用默认的 5173 端口
const DEV_PORT = '5173'
// 后台服务的端口号为 8080
const DEV_BACKEND_PORT = '8080'

const DEV_BACKEND_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${DEV_BACKEND_PORT}`

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
 * 向后端服务发送 API 请求。
 * <p>
 * 使用此方法发送请求，会自动处理以下情况：
 *
 * <ul>
 *   <li>当访问令牌存在时，会自动添加到请求头中</li>
 *   <li>当访问令牌快过期时，会自动刷新访问令牌</li>
 *   <li>当访问令牌过期时，会自动退出登录</li>
 * </ul>
 *
 * @param request 请求配置项
 * @returns Promise<ApiResponse<T>> API 响应结果
 */
export async function requestApi<T>(request: ApiRequest) {
  const auth = getAuth()

  if (!auth) return await requestBackendApi<T>(request)

  const { expiresAt, accessToken } = auth

  const response = await requestBackendApi<T>({
    ...request,
    headers: { ...request.headers, Authorization: `Bearer ${accessToken}` }
  })

  // 检查是否需要重新登录
  if (response.status === 401) {
    clearAuth()
    return { status: response.status, error: '登录过期' }
  }

  // 检查是否需要刷新访问令牌
  // 这里为了测试目的，故意设置离过期时间小于 29 分 55 秒时就刷新访问令牌，即 5 秒后刷新
  if (expiresAt - Date.now() < (30 * 60 - 5) * 1000) {
    await refreshAuth()
  }

  return response
}

async function refreshAuth() {
  const auth = getAuth()

  if (!auth) return

  const { accessToken, refreshToken } = auth

  const { data, error } = await requestBackendApi<AuthResponse>({
    url: `/api/v1/auth/refresh/${refreshToken}`,
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  if (error) {
    clearAuth()
    return
  }

  if (data) {
    setAuth(data)
  }
}

async function requestBackendApi<T>(request: ApiRequest) {
  const { status, data, error } = await sendRequest<T, ApiError>({
    ...request,
    url: `${BASE_URL}${request.url}`
  })

  if (error) {
    return { status, error: typeof error === 'string' ? error : error.error }
  }

  return { status, data }
}
