// ----- 开始：http.ts -----
export type ContentType = 'JSON' | 'URLENCODED' | 'FILE'

export type UrlData = Record<string, string | number | boolean | undefined | null>

export type ApiRequest = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  contentType?: ContentType
  headers?: Record<string, string>
  urlData?: UrlData
  bodyData?: Record<string, unknown> | FormData
  signal?: AbortSignal
}

export type SuccessResponse<T> = {
  data: T
  error: null
}

export type ErrorResponse<T> = {
  data: null
  error: T | string
}

export type ApiResponse<TData, TError> = SuccessResponse<TData> | ErrorResponse<TError>
// ----- 结束：http.ts -----
