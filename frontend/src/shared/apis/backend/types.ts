// ----- 接口通用数据类型 -----
// 错误响应数据类型
export type ApiError = {
  timestamp: string
  status: number
  error: string
  path: string
}

// 分页数据类型
export type PaginationParams = {
  pageNum: number
  pageSize: number
  orderBy?: string
  order?: 'asc' | 'desc'
}

export type PaginationData<T> = {
  pageNum: number
  pageSize: number
  total: number
  list: T[]
}
