import { sendRequest } from '@/shared/utils/http'

export type ApiError = {
  message: string
  name?: string
  expiredAt?: string
}

export type Product = {
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
