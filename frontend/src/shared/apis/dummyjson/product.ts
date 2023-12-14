import { requestDummyJsonApi } from '@/shared/apis/dummyjson/helpers'

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

/**
 * 获取商品详情。
 *
 * @param productId 要获取的商品 ID
 * @returns Promise<Product> 商品详情
 */
export async function getProduct(productId: number) {
  const { data, error } = await requestDummyJsonApi<Product>({
    url: `/products/${productId}`
  })

  if (error) throw new Error(error)

  return data!
}
