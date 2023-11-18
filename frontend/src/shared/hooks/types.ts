// ----- Fetch 相关数据类型 -----
export type FetchResponse<T> = {
  data?: T
  error?: string
}

export type IgnoreFetch = () => void
