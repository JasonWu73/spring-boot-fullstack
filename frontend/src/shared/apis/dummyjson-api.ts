import { sendRequest, type ApiRequest } from '@/shared/utils/http'

const BASE_URL = 'https://dummyjson.com'

export type ApiError = {
  message: string
  name?: string
  expiredAt?: string
}

async function requestApi<T>(request: ApiRequest) {
  const { status, data, error } = await sendRequest<T, ApiError>({
    ...request,
    url: `${BASE_URL}${request.url}`
  })

  if (error) {
    if (typeof error === 'string') return { status, error }

    return { status, error: error.message }
  }

  return { status, data }
}

export { requestApi }
