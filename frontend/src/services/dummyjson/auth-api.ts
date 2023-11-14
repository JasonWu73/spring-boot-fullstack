import {
  type ApiResponse,
  type FetchPayload,
  type ReLogin
} from '@/hooks/use-fetch'
import { sendRequest, type Request } from '@/utils/http'

const BASE_URL = 'https://dummyjson.com/auth'

const EXPIRES_IN_MILLISECONDS = 1

type Error = {
  message: string
  name?: string
  expiredAt?: string
}

type Auth = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
}

type LoginResult = Auth & {
  password: string
}

type LoginParams = {
  username: string
  password: string
  expiresInMins?: number
}

async function loginApi(
  payload: FetchPayload,
  params?: LoginParams
): Promise<ApiResponse<LoginResult>> {
  if (!params) return { data: null, error: '未传入参数' }

  const { data, error } = await sendRequest<Auth, Error>({
    url: `${BASE_URL}/login`,
    signal: payload.signal,
    method: 'POST',
    bodyData: {
      ...params,
      expiresInMins: EXPIRES_IN_MILLISECONDS
    }
  })

  if (error) {
    if (typeof error === 'string') return { data: null, error }

    return { data: null, error: error.message }
  }

  const result = { ...data, password: params.password } as LoginResult
  return { data: result, error: '' }
}

type ReLoginRequest = Omit<Request, 'signal'> & {
  payload: FetchPayload
  reLogin?: ReLogin
}

async function sendAuthDummyJsonApi<T>({
  payload,
  url,
  method = 'GET',
  contentType = 'JSON',
  headers = {},
  urlData,
  bodyData,
  reLogin
}: ReLoginRequest): Promise<ApiResponse<T>> {
  const { auth, signal } = payload

  if (!auth) return { data: null, error: '未登录', reLogin: { isOk: false } }

  const token = reLogin?.isOk ? reLogin.token : auth.token

  const { data, error } = await sendRequest<T, Error>({
    url: `${BASE_URL}/${url}`,
    method,
    contentType,
    headers: { ...headers, Authorization: `Bearer ${token}` },
    urlData,
    bodyData,
    signal
  })

  if (!error) return { data, error: '', reLogin }

  if (typeof error === 'string') return { data: null, error }

  const authFailed =
    error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError'

  if (!reLogin && authFailed) {
    const { username, password } = auth
    if (!username || !password) {
      return { data: null, error: '未登录', reLogin: { isOk: false } }
    }

    // 尝试重新登录，以获取新的 token
    const { data, error } = await loginApi(payload, { username, password })
    if (error) return { data: null, error, reLogin: { isOk: false } }

    return sendAuthDummyJsonApi({
      payload,
      url,
      method,
      contentType,
      urlData,
      bodyData,
      reLogin: { isOk: true, token: data!.token }
    })
  }

  return { data: null, error: error.message }
}

export { loginApi, sendAuthDummyJsonApi, type LoginParams, type LoginResult }
