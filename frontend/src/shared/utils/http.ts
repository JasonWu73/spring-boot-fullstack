import { endNProgress, startNProgress } from '@/shared/utils/nprogress'

type ContentType = 'JSON' | 'URLENCODED' | 'FILE'

type UrlParams = Record<string, string | number | boolean | undefined | null>

type ApiRequest = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  contentType?: ContentType
  headers?: Record<string, string>
  urlParams?: UrlParams
  bodyData?: Record<string, unknown> | FormData
}

type ApiResponse<TData, TError> = {
  status?: number // HTTP 状态码
  data?: TData
  error?: TError | string
}

/**
 * 发送 HTTP 请求，并以 JSON 数据格式解析响应数据。
 *
 * <p>不建议使用 `signal`（`AbortController`）实现中途放弃请求，因为这只会不易于前端 F12 调试（看不到内容），而后端仍然会处理请求。
 * <br>前端要做的事应该只是忽略请求的结果，而非中途放弃请求。
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
    const targetUrl = appendUrlParams(url, urlParams)

    startNProgress()

    // 发送 HTTP 请求
    const response = await fetch(targetUrl, {
      method,
      headers: getHeaders(headers, contentType),
      body:
        contentType === 'FILE'
          ? (bodyData as FormData)
          : contentType === 'URLENCODED'
          ? getUrlEncodedData(bodyData as UrlParams)
          : JSON.stringify(bodyData)
    })

    // 如果 HTTP 状态码为 204，表示请求成功，但无响应数据
    if (response.status === 204) {
      return { status: response.status }
    }

    // 以 JSON 数据格式解析请求
    const responseData = await response.json()

    // 请求失败时，返回异常响应数据
    if (!response.ok) return { status: response.status, error: responseData }

    return { status: response.status, data: responseData }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  } finally {
    endNProgress()
  }
}

function appendUrlParams(url: string, urlParams?: UrlParams) {
  if (!urlParams) return url

  const urlObj = new URL(url)

  Object.keys(urlParams).forEach((key) =>
    urlObj.searchParams.append(key, urlParams[key]?.toString() || '')
  )

  return urlObj.toString()
}

function getHeaders(headers: Record<string, string>, contentType?: ContentType) {
  const jsonAcceptHeaders = {
    ...headers,
    Accept: 'application/json'
  }

  const contentTypeValue = getContentTypeValue(contentType)

  if (!contentTypeValue) return jsonAcceptHeaders

  return {
    ...jsonAcceptHeaders,
    'Content-Type': contentTypeValue
  }
}

function getContentTypeValue(contentType?: ContentType) {
  switch (contentType) {
    case 'FILE':
      return undefined // 不要设置 Content-Type，让浏览器自动设置
    case 'URLENCODED':
      return 'application/x-www-form-urlencoded'
    case 'JSON':
      return 'application/json'
    default:
      return undefined
  }
}

function getUrlEncodedData(bodyData: UrlParams) {
  return Object.keys(bodyData)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(bodyData[key] || '')}`)
    .join('&')
}

export { sendRequest, type ApiRequest }
