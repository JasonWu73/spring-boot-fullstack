// ----- 接口通用数据类型 -----
// 错误响应数据类型
export type ApiError = {
  message: string
  name?: string
  expiredAt?: string
}

// 分页数据类型
export type PaginationData<T> = {
  users: T[]
  total: number
  skip: number
  limit: number
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

// ----- 用户相关数据类型 -----
export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  birthDate: string
  image: string
}
