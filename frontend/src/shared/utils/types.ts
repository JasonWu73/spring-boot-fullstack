// ----- HTTP 工具方法相关类型 -----
export type ContentType = 'JSON' | 'URLENCODED' | 'FILE'

export type UrlParams = Record<string, string | number | boolean | undefined | null>

export type ApiRequest = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  contentType?: ContentType
  headers?: Record<string, string>
  urlParams?: UrlParams
  bodyData?: Record<string, unknown> | FormData
}
