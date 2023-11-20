// ----- Fetch 相关数据类型 -----
export type FetchResponse<T> = {
  status: number // HTTP 响应状态码
  data?: T
  error?: string
}

export type IgnoreFetch = () => void
