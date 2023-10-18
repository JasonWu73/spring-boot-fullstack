import { type ApiResponse } from '@/lib/use-fetch'
import { sendRequest, type Request } from '@/lib/http'

const STORAGE_KEY = 'demo-auth'

const BASE_URL = 'https://dummyjson.com/auth'

type ApiError = {
  message: string
  name?: string
  expiredAt?: string
}

const USERNAME = 'admin'
const PASSWORD = 'admin'
const EXPIRES_IN_MINS = 1

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

type LoginParams = {
  username: string
  password: string
  expiresInMins?: number
}

async function loginApi(
  { username, password }: LoginParams,
  signal?: AbortSignal
): Promise<ApiResponse<Auth>> {
  const { data, error } = await sendRequest<Auth, ApiError>({
    url: `${BASE_URL}/login`,
    method: 'POST',
    bodyData: {
      username: 'jissetts',
      password: 'ePawWgrnZR8L',
      expiresInMins: EXPIRES_IN_MINS
    },
    signal: signal
  })

  if (username !== USERNAME || password !== PASSWORD) {
    return { data: null, error: '用户名或密码错误' }
  }

  if (error) {
    if (typeof error === 'string') {
      return { data: null, error }
    }

    return { data: null, error: error.message }
  }

  return { data, error: '' }
}

type SendRequestWrapper = Request & { initialCall?: boolean }

async function sendAuthDummyJsonApi<T>({
  url,
  method = 'GET',
  contentType = 'JSON',
  urlData,
  bodyData,
  signal,
  initialCall = true
}: SendRequestWrapper): Promise<ApiResponse<T>> {
  const headers = getAuthHeader()

  if (!headers || !headers.Authorization) {
    return { data: null, error: '未登录', authFailed: true }
  }

  const { data, error } = await sendRequest<T, ApiError>({
    url: `${BASE_URL}/${url}`,
    method,
    contentType,
    headers,
    urlData,
    bodyData,
    signal
  })

  if (!error) {
    return { data, error: '' }
  }

  if (typeof error === 'string') {
    return { data: null, error }
  }

  const authFailed =
    error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError'

  if (authFailed) {
    removeAuthFromLocalStorage()
  }

  if (!initialCall) {
    return { data: null, error: error.message, authFailed }
  }

  if (authFailed) {
    const { data, error } = await loginApi({
      username: USERNAME,
      password: PASSWORD
    })

    if (error) {
      return { data: null, error, authFailed: true }
    }

    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

      return sendAuthDummyJsonApi({
        url,
        method,
        contentType,
        urlData,
        bodyData,
        signal,
        initialCall: false
      })
    }
  }

  return { data: null, error: error.message }
}

type AuthHeader = { Authorization: string } | null

function getAuthHeader(): AuthHeader {
  const auth = getAuthFromLocalStorage()

  if (!auth || !auth.token) {
    return null
  }

  return { Authorization: `Bearer ${auth.token}` }
}

function getAuthFromLocalStorage(): Auth | null {
  const storageValue = localStorage.getItem(STORAGE_KEY)

  if (!storageValue) {
    return null
  }

  return JSON.parse(storageValue)
}

function removeAuthFromLocalStorage() {
  localStorage.removeItem(STORAGE_KEY)
}

export {
  loginApi,
  STORAGE_KEY,
  sendAuthDummyJsonApi,
  getAuthFromLocalStorage,
  removeAuthFromLocalStorage,
  type Auth
}
