import { type ApiResponse } from '@/lib/use-fetch'
import { sendAuthDummyJsonApi } from '@/api/dummyjson/auth'

type Product = {
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
  signal?: AbortSignal
): Promise<ApiResponse<Product>> {
  const randomId = Math.floor(Math.random() * 110)

  return await sendAuthDummyJsonApi<Product>({
    url: `products/${randomId}`,
    signal: signal
  })
}

export { getRandomProductApi, type Product }
