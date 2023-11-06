import { type FetchPayload } from '@/hooks/use-fetch'
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

async function getRandomProductApi(payload: FetchPayload) {
  const randomId = Math.floor(Math.random() * 110)

  return await sendAuthDummyJsonApi<Product>({
    payload,
    url: `products/${randomId}`
  })
}

export { getRandomProductApi, type Product }
