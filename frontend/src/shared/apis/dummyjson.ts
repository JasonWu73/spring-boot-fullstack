import { sendRequest, type ApiRequest } from '@/shared/utils/api-caller'

const BASE_URL = 'https://dummyjson.com'

type ApiError = {
  message: string
  name?: string
  expiredAt?: string
}

export async function requestApi<T>(request: ApiRequest) {
  const { status, data, error } = await sendRequest<T, ApiError>({
    ...request,
    url: `${BASE_URL}${request.url}`
  })

  if (error) {
    return { status, error: typeof error === 'string' ? error : error.message }
  }

  return { status, data }
}
