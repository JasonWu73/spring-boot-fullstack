import { sendAuthDummyJsonApi } from '@/shared/apis/dummyjson/auth-api'
import type { Product } from '@/shared/apis/dummyjson/types'
import type { FetchPayload, FetchResponse } from '@/shared/hooks/types'

async function getRandomProductApi(
  payload: FetchPayload
): Promise<FetchResponse<Product>> {
  const randomId = Math.floor(Math.random() * 110)

  return await sendAuthDummyJsonApi<Product>({
    payload,
    url: `products/${randomId}`
  })
}

export { getRandomProductApi }
