import { type ApiResponse } from '@/hooks/use-fetch'
import { sendRequest, type Request } from '@/lib/http'
import {
  type Auth,
  PRIVATE_KEY,
  STORAGE_KEY
} from '@/components/auth/AuthProvider'
import { decrypt } from '@/lib/rsa'

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

type LoginParams = {
  username: string
  password: string
  expiresInMins?: number
}

async function loginApi(
  { username, password }: LoginParams,
  signal?: AbortSignal
): Promise<ApiResponse<AuthResponse>> {
  const { data, error } = await sendRequest<AuthResponse, ApiError>({
    url: `${BASE_URL}/login`,
    method: 'POST',
    bodyData: {
      username: username,
      password: password,
      expiresInMins: EXPIRES_IN_MINS
    },
    signal: signal
  })

  if (error) {
    if (typeof error === 'string') {
      return { data: null, error }
    }

    return { data: null, error: error.message }
  }

  return { data, error: '' }
}

type SendRequestWrapper<T> = Request & Pick<ApiResponse<T>, 'auth'>

async function sendAuthDummyJsonApi<T>({
  url,
  method = 'GET',
  contentType = 'JSON',
  urlData,
  bodyData,
  signal,
  auth
}: SendRequestWrapper<T>): Promise<ApiResponse<T>> {
  const authCache = getAuthFromLocalStorage()

  if (!authCache) {
    return { data: null, error: '未登录', auth: { isOk: false } }
  }

  const token = auth?.isOk ? auth.token : authCache.token

  const { data, error } = await sendRequest<T, ApiError>({
    url: `${BASE_URL}/${url}`,
    method,
    contentType,
    headers: { Authorization: `Bearer ${token}` },
    urlData,
    bodyData,
    signal
  })

  if (!error) {
    return { data, error: '', auth }
  }

  if (typeof error === 'string') {
    return { data: null, error }
  }

  const authFailed =
    error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError'

  if (!auth && authFailed) {
    const { data, error } = await tryReLogin(
      authCache.username,
      authCache.password
    )

    if (error) {
      return { data: null, error, auth: { isOk: false } }
    }

    if (data) {
      return sendAuthDummyJsonApi({
        url,
        method,
        contentType,
        urlData,
        bodyData,
        signal,
        auth: { isOk: true, token: data.token }
      })
    }
  }

  return { data: null, error: error.message }
}

async function tryReLogin(
  encryptedUsername: string,
  encryptedPassword: string
) {
  const username = decrypt(PRIVATE_KEY, encryptedUsername)
  const password = decrypt(PRIVATE_KEY, encryptedPassword)

  if (!username || !password) {
    return { data: null, error: '加密数据有误' }
  }

  const { data, error } = await loginApi({ username, password })

  if (error) {
    return { data: null, error }
  }

  return { data, error }
}

function getAuthFromLocalStorage(): Auth | null {
  const storageValue = localStorage.getItem(STORAGE_KEY)

  if (!storageValue) {
    return null
  }

  return JSON.parse(storageValue)
}

export { loginApi, sendAuthDummyJsonApi, type AuthResponse }
