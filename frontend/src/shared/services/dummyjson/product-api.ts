import { type ApiResponse, type FetchPayload } from '@/shared/hooks/use-fetch'
import { sendAuthDummyJsonApi } from '@/shared/services/dummyjson/auth-api'
import type { Product } from '@/shared/services/dummyjson/types'

async function getRandomProductApi(payload: FetchPayload): Promise<ApiResponse<Product>> {
  const randomId = Math.floor(Math.random() * 110)

  return await sendAuthDummyJsonApi<Product>({
    payload,
    url: `products/${randomId}`
  })
}

export { getRandomProductApi }
