import { BASE_URL } from '@/shared/apis/backend/constants'
import type {
  ApiError,
  Auth as AuthResponse,
  LoginParams
} from '@/shared/apis/backend/types'
import type { Auth, FetchResponse, ReLogin } from '@/shared/hooks/types'
import { sendRequest } from '@/shared/utils/http'
import type { ApiRequest } from '@/shared/utils/types'

async function loginApi(params: LoginParams) {
  return await requestApi<AuthResponse>({
    url: '/api/v1/auth/login',
    signal: params.abortSignal,
    method: 'POST',
    bodyData: params
  })
}

async function logoutApi(auth: Auth) {
  return await requestAuthApi<void>({
    auth,
    url: '/api/v1/auth/logout',
    method: 'DELETE'
  })
}

async function requestApi<T>(request: ApiRequest): Promise<FetchResponse<T>> {
  const { data, error } = await sendRequest<T, ApiError>({
    ...request,
    url: `${BASE_URL}${request.url}`
  })

  if (error) {
    if (typeof error === 'string') return { data: null, error }

    return { data: null, error: error.error }
  }

  return { data, error: '' }
}

type ReLoginRequest = Omit<ApiRequest, 'signal'> & {
  auth: Auth
  reLogin?: ReLogin
}

async function requestAuthApi<T>(request: ReLoginRequest): Promise<FetchResponse<T>> {
  const { url, headers, auth, reLogin } = request

  if (!auth) return { data: null, error: '未登录', reLogin: { success: false } }

  const accessToken = reLogin?.success ? reLogin.auth.accessToken : auth.accessToken

  const { data, error } = await sendRequest<T, ApiError>({
    ...request,
    url: `${BASE_URL}${url}`,
    headers: { ...headers, Authorization: `Bearer ${accessToken}` }
  })

  if (!error) return { data, error: '', reLogin }

  if (typeof error === 'string') return { data: null, error }

  if (!reLogin && error.error === 'TokenExpiredError') {
    const { refreshToken } = auth
    if (!refreshToken) {
      return { data: null, error: '未登录', reLogin: { success: false } }
    }

    // 尝试重新登录，以获取新的访问令牌
    const { data, error } = await sendRequest<Auth, ApiError>({
      url: `${BASE_URL}/api/v1/auth/refresh/${refreshToken}`,
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    if (error) {
      if (typeof error === 'string')
        return { data: null, error, reLogin: { success: false } }

      return { data: null, error: error.error, reLogin: { success: false } }
    }

    return requestAuthApi({
      ...request,
      reLogin: { success: true, auth: data! }
    })
  }

  return { data: null, error: error.error }
}

export { loginApi, logoutApi, requestApi, requestAuthApi }
