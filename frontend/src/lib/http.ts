import NProgress from 'nprogress'

type ContentType = 'JSON' | 'FORM' | 'FILE'

type UrlData = Record<string, string | number | boolean>
type BodyData = Record<string, unknown> | FormData

type Request = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  contentType?: ContentType
  urlData?: UrlData
  bodyData?: BodyData
  signal?: AbortSignal
}

type UrlInfo = Pick<Request, 'url' | 'urlData'>

type RequestConfig = Pick<
  Request,
  'method' | 'contentType' | 'bodyData' | 'signal'
>

type RequestBody = Pick<Request, 'contentType' | 'bodyData'>

type Response<T, E> = {
  data: T | null
  error: E | string | null
}

/**
 * 发送 HTTP 请求, 并以 JSON 数据格式解析响应数据.
 *
 * @template T - 成功响应时的数据类型
 * @template E - 错误响应时的数据类型
 *
 * @param Request - 请求的配置属性
 * @param Request.url - URL 地址
 * @param Request.method - 请求方法, 默认为 `GET`
 * @param Request.contentType - 请求体的内容类型, 默认为 `JSON`
 * @param Request.urlData - URL 参数
 * @param Request.bodyData - 请求体数据
 * @param Request.signal - `AbortController` 实例的 `signal` 属性, 用于主动取消请求
 * @returns {Promise<Response<T, E>>} - 以 JSON 数据格式解析后的正常或异常响应数据
 */
async function sendRequest<T, E>({
  url,
  method = 'GET',
  contentType = 'JSON',
  urlData,
  bodyData,
  signal
}: Request): Promise<Response<T, E>> {
  try {
    // 开始加载动画
    NProgress.start()

    // 追加 URL 参数
    const splicedUrl = appendParamsToUrl({ url, urlData })

    // 发送 HTTP 请求
    const response = await fetch(
      splicedUrl,
      getRequestOptions({ method, contentType, bodyData, signal })
    )

    // 以 JSON 数据格式解析请求
    const responseData = await response.json()

    // 请求失败时, 返回异常响应数据
    if (!response.ok) {
      return { data: null, error: responseData }
    }

    // 请求成功时, 返回正常响应数据
    return { data: responseData, error: null }
  } catch (error) {
    // 忽略因主动取消请求而产生的非程序异常
    if (error instanceof Error && error.name === 'AbortError') {
      console.log(`${error.message} [${method} ${url}]`)
      return { data: null, error: null }
    }

    // 处理程序异常
    return { data: null, error: String(error) }
  } finally {
    // 结束加载动画
    NProgress.done()
  }
}

function appendParamsToUrl({ url, urlData }: UrlInfo) {
  const urlObj = new URL(url)
  urlData &&
    Object.keys(urlData).forEach((key) =>
      urlObj.searchParams.append(key, urlData[key].toString())
    )
  return urlObj.toString()
}

function getRequestOptions({
  method,
  contentType = 'JSON',
  bodyData,
  signal
}: RequestConfig) {
  if (method === 'GET') {
    return { signal }
  }

  const headers = getHeaders(contentType)

  return {
    method,
    headers,
    body: getBody({ contentType, bodyData }),
    signal
  }
}

function getHeaders(type: ContentType): Record<string, string> {
  switch (type) {
    case 'FILE':
      return {}
    case 'FORM':
      return { 'Content-Type': 'application/x-www-form-urlencoded' }
    default:
      return { 'Content-Type': 'application/json' }
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
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(bodyData[key])
    )
    .join('&')
}

export { sendRequest }
