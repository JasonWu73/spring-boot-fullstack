// 分页参数类型
export type PaginationParams = {
  pageNum: number
  pageSize: number
  sortColumn?: string
  sortOrder?: 'asc' | 'desc'
}

// 分页数据类型
export type PaginationData<T> = {
  pageNum: number
  pageSize: number
  total: number
  list: T[]
}
