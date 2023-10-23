type ContentType = 'JSON' | 'FORM' | 'FILE'

type UrlData = Record<string, string | number | boolean | undefined | null>
type BodyData = Record<string, unknown> | FormData

type Request = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  contentType?: ContentType
  headers?: Record<string, string>
  urlData?: UrlData
  bodyData?: BodyData
  signal?: AbortSignal
}

type UrlInfo = Pick<Request, 'url' | 'urlData'>

type RequestConfig = Pick<
  Request,
  'method' | 'contentType' | 'headers' | 'bodyData' | 'signal'
>

type RequestBody = Pick<Request, 'contentType' | 'bodyData'>

type Response<TData, TError> = {
  data: TData | null
  error: TError | string | null
}

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
 * @returns - 以 JSON 数据格式解析后的正常或异常响应数据
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
    const splicedUrl = appendParamsToUrl({ url, urlData })

    // 发送 HTTP 请求
    const response = await fetch(
      splicedUrl,
      getRequestOptions({ method, contentType, headers, bodyData, signal })
    )

    // 以 JSON 数据格式解析请求
    const responseData = await response.json()

    // 请求失败时，返回异常响应数据
    if (!response.ok) {
      return { data: null, error: responseData }
    }

    // 请求成功时，返回正常响应数据
    return { data: responseData, error: null }
  } catch (error) {
    // 忽略因主动取消请求而产生的非程序异常
    // 此时无需结束加载画面
    if (error instanceof Error && error.name === 'AbortError') {
      console.log(`${error.message} [${method} ${url}]`)
      return { data: null, error: null }
    }

    // 处理程序异常
    return { data: null, error: String(error) }
  }
}

function appendParamsToUrl({ url, urlData }: UrlInfo) {
  const urlObj = new URL(url)
  urlData &&
    Object.keys(urlData).forEach((key) =>
      urlObj.searchParams.append(key, urlData[key]?.toString() ?? '')
    )
  return urlObj.toString()
}

function getRequestOptions({
  method,
  contentType = 'JSON',
  headers = {},
  bodyData,
  signal
}: RequestConfig) {
  const mergedHeaders = getHeaders(contentType, headers)

  if (method === 'GET') {
    return { headers: mergedHeaders, signal }
  }

  return {
    method,
    headers: mergedHeaders,
    body: getBody({ contentType, bodyData }),
    signal
  }
}

function getHeaders(
  type: ContentType,
  headers: Record<string, string>
): Record<string, string> {
  switch (type) {
    case 'FILE':
      return { ...headers }
    case 'FORM':
      return { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' }
    default:
      return { ...headers, 'Content-Type': 'application/json' }
  }
}

function getBody({ contentType, bodyData }: RequestBody) {
  switch (contentType) {
    case 'FILE':
      return bodyData as FormData
    case 'FORM':
      return getUrlEncodedData(bodyData as UrlData)
    default:
      return JSON.stringify(bodyData)
  }
}

function getUrlEncodedData(bodyData: UrlData) {
  return Object.keys(bodyData)
    .map(
      (key) =>
        encodeURIComponent(key) + '=' + encodeURIComponent(bodyData[key] ?? '')
    )
    .join('&')
}

export { sendRequest, type Request, type Response }
