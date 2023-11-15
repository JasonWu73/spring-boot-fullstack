type ContentType = 'JSON' | 'URLENCODED' | 'FILE'

type UrlData = Record<string, string | number | boolean | undefined | null>

type Request = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  contentType?: ContentType
  headers?: Record<string, string>
  urlData?: UrlData
  bodyData?: Record<string, unknown> | FormData
  signal?: AbortSignal
}

type SuccessResponse<T> = {
  data: T
  error: null
}

type ErrorResponse<T> = {
  data: null
  error: T | string
}

type Response<TData, TError> = SuccessResponse<TData> | ErrorResponse<TError>

/**
 * 发送 HTTP 请求，并以 JSON 数据格式解析响应数据。
 *
 * @template TData - 成功响应时的数据类型
 * @template TError - 错误响应时的数据类型
 *
 * @param Request - 请求的配置属性
 * @param Request.url - URL 地址
 * @param Request.method - 请求方法，默认为 `GET`
 * @param Request.contentType - 请求体的内容类型，默认为 `JSON`
 * @param Request.headers - HTTP 请求头
 * @param Request.urlData - URL 参数
 * @param Request.bodyData - 请求体数据
 * @param Request.signal - `AbortController` 实例的 `signal` 属性，用于主动取消请求
 * @returns {Promise<Response<TData, TError>>} - 以 JSON 数据格式解析后的正常或异常响应数据
 */
async function sendRequest<TData, TError>({
  url,
  method = 'GET',
  contentType = 'JSON',
  headers = {},
  urlData,
  bodyData,
  signal
}: Request): Promise<Response<TData, TError>> {
  try {
    // 追加 URL 参数
    const urlObj = new URL(url)
    if (urlData) {
      Object.keys(urlData).forEach((key) =>
        urlObj.searchParams.append(key, urlData[key]?.toString() || '')
      )
    }

    // 构造请求配置
    const options: RequestInit = {
      method,
      signal,
      headers: {
        ...headers,
        Accept: 'application/json',
        'content-Type':
          contentType === 'FILE'
            ? '' // 不要设置 Content-Type，让浏览器自动设置
            : contentType === 'URLENCODED'
            ? 'application/x-www-form-urlencoded'
            : 'application/json'
      },
      body:
        contentType === 'FILE'
          ? (bodyData as FormData)
          : contentType === 'URLENCODED'
          ? Object.keys(bodyData as UrlData)
              .map(
                (key) =>
                  `${encodeURIComponent(key)}=${encodeURIComponent(
                    (bodyData as UrlData)[key] || ''
                  )}`
              )
              .join('&')
          : JSON.stringify(bodyData)
    }

    // 发送 HTTP 请求
    const response = await fetch(urlObj, options)

    // 以 JSON 数据格式解析请求
    const responseData = await response.json()

    // 请求失败时，返回异常响应数据
    if (!response.ok) return { data: null, error: responseData }

    // 请求成功时，返回正常响应数据
    return { data: responseData, error: null }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { data: null, error: '用户主动取消了请求' }
    }

    if (error instanceof Error) return { data: null, error: error.message }

    return { data: null, error: String(error) }
  }
}

export { sendRequest, type Request, type Response }
