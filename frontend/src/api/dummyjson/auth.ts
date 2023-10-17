import { type ApiResponse } from '@/lib/use-fetch'
import { sendRequest } from '@/lib/http'
import { type ApiError, BASE_URL } from '@/api/dummyjson/dummyjson-constants'

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
  { username, password, expiresInMins = 1 }: LoginParams,
  signal?: AbortSignal
): Promise<ApiResponse<Auth>> {
  const { data, error } = await sendRequest<Auth, ApiError>({
    url: `${BASE_URL}/auth/login`,
    bodyData: {
      username,
      password,
      expiresInMins
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

export { loginApi, type Auth }
