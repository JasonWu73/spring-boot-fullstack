import type { ApiError, Product } from '@/shared/apis/dummyjson/types'
import { sendRequest } from '@/shared/utils/http'

type Params = {
  abortSignal?: AbortSignal
}

async function getRandomProductApi(params?: Params) {
  const randomId = Math.floor(Math.random() * 110)

  const { data, error } = await sendRequest<Product, ApiError>({
    url: `https://dummyjson.com/products/${randomId}`,
    signal: params?.abortSignal
  })

  if (error) {
    if (typeof error === 'string') return { data: null, error }

    return { data: null, error: error.message }
  }

  return { data, error: '' }
}

export { getRandomProductApi }
