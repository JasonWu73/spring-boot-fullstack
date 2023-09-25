import { sendRequest } from '@/lib/http.ts'

type ApiError = {
  message: string
}

type ApiResponse<T> = {
  data: T | null
  error: ApiError | null
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

async function getRandomProduct(signal?: AbortSignal): Promise<ApiResponse<Product>> {
  const randomId = Math.floor(Math.random() * 110)
  const { data, error } = await sendRequest<Product, ApiError>({
    url: `https://dummyjson.com/products/${randomId}`,
    signal: signal
  })

  // 统一处理错误
  if (typeof error === 'string') {
    return { data, error: { message: error } }
  }

  return { data, error }
}

export { type Product, getRandomProduct }
