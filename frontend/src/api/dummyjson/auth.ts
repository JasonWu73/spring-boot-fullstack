import {
  type ApiResponse,
  type FetchPayload,
  type ReLogin
} from '@/hooks/use-fetch'
import { sendRequest, type Request } from '@/lib/http'

const BASE_URL = 'https://dummyjson.com/auth'

type ApiError = {
  message: string
  name?: string
  expiredAt?: string
}

const EXPIRES_IN_MINS = 1

type AuthResponse = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
}

type LoginResult = AuthResponse & {
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
  if (!params) {
    return { data: null, error: '未传入参数' }
  }

  const { username, password } = params

  const { data, error } = await sendRequest<AuthResponse, ApiError>({
    url: `${BASE_URL}/login`,
    method: 'POST',
    bodyData: {
      username: username,
      password: password,
      expiresInMins: EXPIRES_IN_MINS
    },
    signal: payload.signal
  })

  if (error) {
    if (typeof error === 'string') {
      return { data: null, error }
    }

    return { data: null, error: error.message }
  }

  const result = { ...data, password } as LoginResult

  return { data: result, error: '' }
}

type SendRequestWrapper = Omit<Request, 'signal'> & {
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
}: SendRequestWrapper): Promise<ApiResponse<T>> {
  const { signal, auth } = payload

  if (!auth) {
    return { data: null, error: '未登录', reLogin: { isOk: false } }
  }

  const token = reLogin?.isOk ? reLogin.token : auth.token

  const { data, error } = await sendRequest<T, ApiError>({
    url: `${BASE_URL}/${url}`,
    method,
    contentType,
    headers: { ...headers, Authorization: `Bearer ${token}` },
    urlData,
    bodyData,
    signal
  })

  if (!error) {
    return { data, error: '', reLogin }
  }

  if (typeof error === 'string') {
    return { data: null, error }
  }

  const authFailed =
    error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError'

  if (!reLogin && authFailed) {
    const { data, error } = await tryReLogin(payload, {
      username: auth.username,
      password: auth.password
    })

    if (error) {
      return { data: null, error, reLogin: { isOk: false } }
    }

    if (data) {
      return sendAuthDummyJsonApi({
        payload,
        url,
        method,
        contentType,
        urlData,
        bodyData,
        reLogin: { isOk: true, token: data.token }
      })
    }
  }

  return { data: null, error: error.message }
}

async function tryReLogin(payload: FetchPayload, params: LoginParams) {
  const { data, error } = await loginApi(payload, params)

  if (error) {
    return { data: null, error }
  }

  return { data, error }
}

export { loginApi, sendAuthDummyJsonApi }