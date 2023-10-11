import { sendRequest } from '@/lib/http'
import { ApiResponse } from '@/lib/use-fetch'

type ApiError = {
  message: string
}

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

async function getRandomProduct(
  signal?: AbortSignal
): Promise<ApiResponse<Product>> {
  const randomId = Math.floor(Math.random() * 110)
  const { data, error } = await sendRequest<Product, ApiError>({
    url: `https://dummyjson.com/products/${randomId}`,
    signal: signal
  })

  if (error) {
    if (typeof error === 'string') {
      return { data: null, error }
    }

    return { data: null, error: error.message }
  }

  return { data, error: '' }
}

export { getRandomProduct, type Product }
