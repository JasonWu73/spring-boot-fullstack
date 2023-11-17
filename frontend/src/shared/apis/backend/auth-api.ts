import { BASE_URL } from '@/shared/apis/backend/constants'
import type { ApiError, Auth, LoginParams } from '@/shared/apis/backend/types'
import type { FetchPayload, FetchResponse, ReLogin } from '@/shared/hooks/types'
import { sendRequest } from '@/shared/utils/http'
import type { ApiRequest } from '@/shared/utils/types'

async function loginApi(
  payload: FetchPayload,
  params?: LoginParams
): Promise<FetchResponse<Auth>> {
  if (!params) return { data: null, error: '未传入参数' }

  const { data, error } = await sendRequest<Auth, ApiError>({
    url: `${BASE_URL}/api/v1/auth/login`,
    signal: payload.signal,
    method: 'POST',
    bodyData: params
  })

  if (error) {
    if (typeof error === 'string') return { data: null, error }

    return { data: null, error: error.error }
  }

  return { data, error: '' }
}

type ReLoginRequest = Omit<ApiRequest, 'signal'> & {
  payload: FetchPayload
  reLogin?: ReLogin
}

async function sendAuthApi<T>({
  payload,
  url,
  method = 'GET',
  contentType = 'JSON',
  headers = {},
  urlData,
  bodyData,
  reLogin
}: ReLoginRequest): Promise<FetchResponse<T>> {
  const { auth, signal } = payload

  if (!auth) return { data: null, error: '未登录', reLogin: { isOk: false } }

  const accessToken = reLogin?.isOk ? reLogin.auth.accessToken : auth.accessToken

  const { data, error } = await sendRequest<T, ApiError>({
    url: `${BASE_URL}/${url}`,
    method,
    contentType,
    headers: { ...headers, Authorization: `Bearer ${accessToken}` },
    urlData,
    bodyData,
    signal
  })

  if (!error) return { data, error: '', reLogin }

  if (typeof error === 'string') return { data: null, error }

  if (!reLogin && error.error === 'TokenExpiredError') {
    const { refreshToken } = auth
    if (!refreshToken) {
      return { data: null, error: '未登录', reLogin: { isOk: false } }
    }

    // 尝试重新登录，以获取新的访问令牌
    const { data, error } = await sendRequest<Auth, ApiError>({
      url: `${BASE_URL}/api/v1/auth/refresh:${refreshToken}`,
      method: 'POST'
    })
    if (error) {
      if (typeof error === 'string') return { data: null, error }

      return { data: null, error: error.error }
    }

    return sendAuthApi({
      payload,
      url,
      method,
      contentType,
      urlData,
      bodyData,
      reLogin: { isOk: true, auth: data! }
    })
  }

  return { data: null, error: error.error }
}

export { loginApi, sendAuthApi }
