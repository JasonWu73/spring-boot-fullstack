import type { ApiError, Product } from '@/shared/apis/dummyjson/types'
import type { FetchPayload, FetchResponse } from '@/shared/hooks/types'
import { sendRequest } from '@/shared/utils/http'

async function getRandomProductApi(
  payload: FetchPayload
): Promise<FetchResponse<Product>> {
  const randomId = Math.floor(Math.random() * 110)

  const { data, error } = await sendRequest<Product, ApiError>({
    url: `https://dummyjson.com/products/${randomId}`,
    signal: payload.signal
  })

  if (error) {
    if (typeof error === 'string') return { data: null, error }

    return { data: null, error: error.message }
  }

  return { data, error: '' }
}

export { getRandomProductApi }
