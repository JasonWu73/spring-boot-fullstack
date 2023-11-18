import { BASE_URL } from '@/shared/apis/backend/constants'
import type {
  ApiError,
  Auth as AuthResponse,
  LoginParams
} from '@/shared/apis/backend/types'
import type { FetchResponse } from '@/shared/hooks/types'
import { sendRequest } from '@/shared/utils/http'
import type { ApiRequest } from '@/shared/utils/types'

async function loginApi(params: LoginParams) {
  return await requestApi<AuthResponse>({
    url: '/api/v1/auth/login',
    method: 'POST',
    bodyData: params
  })
}

async function refreshApi(accessToken: string, refreshToken: string) {
  const { data, error } = await sendRequest<AuthResponse, ApiError>({
    url: `${BASE_URL}/api/v1/auth/refresh/${refreshToken}`,
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  if (error) {
    if (typeof error === 'string') return { error }

    return { error: error.error }
  }

  return { data: data ?? undefined }
}

async function requestApi<T>(request: ApiRequest): Promise<FetchResponse<T>> {
  const { data, error } = await sendRequest<T, ApiError>({
    ...request,
    url: `${BASE_URL}${request.url}`
  })

  if (error) {
    if (typeof error === 'string') return { error }

    return { error: error.error }
  }

  return { data: data ?? undefined }
}

export { loginApi, refreshApi, requestApi }
