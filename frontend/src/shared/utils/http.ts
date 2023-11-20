import type { ApiRequest, UrlParams } from '@/shared/utils/types'

const CUSTOM_HTTP_STATUS_ERROR_CODE = 999

type SuccessResponse<T> = {
  status: number
  data: T | null
  error: null
}

type ErrorResponse<T> = {
  status: number
  data: null
  error: T | string
}

type ApiResponse<TData, TError> = SuccessResponse<TData> | ErrorResponse<TError>

/**
 * 发送 HTTP 请求，并以 JSON 数据格式解析响应数据。
 *
 * <p>不建议使用 `signal` 实现主动取消请求，因为这只会不易于前端 F12 调试（看不到内容），而后端仍然会处理请求。
 * <br>前端要做的事应该只是忽略请求的结果，而非取消请求。
 *
 * @template TData - 成功响应时的数据类型
 * @template TError - 错误响应时的数据类型
 *
 * @param Request - 请求的配置属性
 * @param Request.url - URL 地址
 * @param Request.method - 请求方法，默认为 `GET`
 * @param Request.contentType - 请求体的内容类型，默认为 `JSON`
 * @param Request.headers - HTTP 请求头
 * @param Request.urlParams - URL 参数
 * @param Request.bodyData - 请求体数据
 * @returns {Promise<Response<TData, TError>>} - 以 JSON 数据格式解析后的正常或异常响应数据
 */
async function sendRequest<TData, TError>({
  url,
  method = 'GET',
  contentType = 'JSON',
  headers = {},
  urlParams,
  bodyData
}: ApiRequest): Promise<ApiResponse<TData, TError>> {
  try {
    // 追加 URL 参数
    const urlObj = new URL(url)
    if (urlParams) {
      Object.keys(urlParams).forEach((key) =>
        urlObj.searchParams.append(key, urlParams[key]?.toString() || '')
      )
    }

    // 构造请求配置
    const options: RequestInit = {
      method,
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
          ? Object.keys(bodyData as UrlParams)
              .map(
                (key) =>
                  `${encodeURIComponent(key)}=${encodeURIComponent(
                    (bodyData as UrlParams)[key] || ''
                  )}`
              )
              .join('&')
          : JSON.stringify(bodyData)
    }

    // 发送 HTTP 请求
    const response = await fetch(urlObj, options)

    // 如果 HTTP 状态码为 204，表示请求成功，但无响应数据
    if (response.status === 204) {
      return { status: response.status, data: null, error: null }
    }

    // 以 JSON 数据格式解析请求
    const responseData = await response.json()

    // 请求失败时，返回异常响应数据
    if (!response.ok) return { status: response.status, data: null, error: responseData }

    return { status: response.status, data: responseData, error: null }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        status: CUSTOM_HTTP_STATUS_ERROR_CODE,
        data: null,
        error: '用户主动取消了请求'
      }
    }

    if (error instanceof Error)
      return { status: CUSTOM_HTTP_STATUS_ERROR_CODE, data: null, error: error.message }

    return { status: CUSTOM_HTTP_STATUS_ERROR_CODE, data: null, error: String(error) }
  }
}

export { CUSTOM_HTTP_STATUS_ERROR_CODE, sendRequest }
