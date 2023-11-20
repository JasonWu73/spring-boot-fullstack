import type { ApiError, Product } from '@/shared/apis/dummyjson/types'
import { sendRequest } from '@/shared/utils/http'

async function getRandomProductApi() {
  const randomId = Math.floor(Math.random() * 110)

  const { status, data, error } = await sendRequest<Product, ApiError>({
    url: `https://dummyjson.com/products/${randomId}`
  })

  if (error) {
    if (typeof error === 'string') return { status, data: null, error }

    return { status, data: null, error: error.message }
  }

  return { status, data, error: '' }
}

export { getRandomProductApi }
