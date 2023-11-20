// ----- 接口通用数据类型 -----
// 错误响应数据类型
export type ApiError = {
  message: string
  name?: string
  expiredAt?: string
}

// ----- 商品相关数据类型 -----
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
