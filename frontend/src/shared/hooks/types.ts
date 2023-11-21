// ----- Fetch 相关数据类型 -----
export type Action<TData> =
  | { type: 'START_LOADING' }
  | { type: 'FETCH_SUCCESS'; payload: { status: number; data: TData | null } }
  | { type: 'FETCH_FAILED'; payload: { status: number; error: string } }
  | { type: 'IGNORE_FETCH' } // 只是忽略请求的结果，而非取消请求；取消请求只会不易于前端调试，因为后端仍然会处理请求

export type FetchResponse<T> = {
  status: number // HTTP 响应状态码
  data?: T
  error?: string
}

export type IgnoreFetch = () => void
