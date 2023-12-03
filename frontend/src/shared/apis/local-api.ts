import { sendRequest, type ApiRequest } from '@/shared/utils/api-caller'

const BASE_URL = `${window.location.origin}`

async function requestApi<T>(request: ApiRequest) {
  const { status, data, error } = await sendRequest<T, string>({
    ...request,
    url: `${BASE_URL}${request.url}`
  })

  if (error) return { status, error }

  return { status, data }
}

export { requestApi }
