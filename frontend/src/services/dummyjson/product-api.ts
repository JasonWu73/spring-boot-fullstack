import {type ApiResponse, type FetchPayload} from '@/hooks/use-fetch'
import {sendAuthDummyJsonApi} from '@/services/dummyjson/auth-api'

type ProductResponse = {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}

async function getRandomProductApi(
  payload: FetchPayload
): Promise<ApiResponse<ProductResponse>> {
  const randomId = Math.floor(Math.random() * 110)

  return await sendAuthDummyJsonApi<ProductResponse>({
    payload,
    url: `products/${randomId}`
  })
}

export {getRandomProductApi, type ProductResponse}
