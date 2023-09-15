type ContentType = 'JSON' | 'FORM' | 'FILE';
type UrlParams = { [key: string]: string | number | boolean };

type Request = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  urlParams?: UrlParams;
  contentType?: ContentType;
  bodyParams?: object | UrlParams | FormData;
  signal?: AbortSignal;
};

type Url = Pick<Request, 'url' | 'urlParams'>;
type RequestOptions = Pick<Request, 'method' | 'contentType' | 'bodyParams' | 'signal'>;
type BodyOptions = Pick<Request, 'contentType' | 'bodyParams'>;

type Response<T, E> = {
  data: T | null;
  error: E | string | null;
};

/**
 * 发送 HTTP GET JSON 请求。
 *
 * @param url 请求地址
 * @param params URL 请求参数
 * @param signal `AbortController` 实例的 `signal` 属性，用于主动取消请求
 */
export async function sendRequest<T, E>({
                                          method = 'GET',
                                          url,
                                          urlParams,
                                          contentType = 'JSON',
                                          bodyParams,
                                          signal
                                        }: Request): Promise<Response<T, E>> {
  try {
    // 添加 URL 参数
    const paramsToUrl = appendParamsToUrl({ url, urlParams });

    // 获取请求配置项
    const options = getRequestOptions({ method, contentType, bodyParams, signal });

    // 发送请求
    const response = await fetch(paramsToUrl, options);

    // 解析请求
    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data };
    }

    return { data, error: null };
  } catch (error) {
    // 处理非程序异步，即用户主动取消请求的异步
    if (error instanceof Error && error.name === 'AbortError') {
      return { data: null, error: null };
    }

    // 处理程序异常
    return { data: null, error: error + '' };
  }
}

function appendParamsToUrl({ url, urlParams }: Url) {
  // 使用 URLSearchParams 处理 URL 参数
  const urlObj = new URL(url);
  if (urlParams) {
    Object.keys(urlParams).forEach(key => urlObj.searchParams.append(key, urlParams[key].toString()));
  }
  return urlObj.toString();
}

function getRequestOptions({ method, contentType, bodyParams, signal }: RequestOptions) {
  if (method === 'GET') {
    return { signal };
  }

  const headers = getHeaders(contentType!);

  return {
    method,
    headers,
    body: getBody({ contentType, bodyParams }),
    signal
  };
}

function getHeaders(type: ContentType): Record<string, string> {
  switch (type) {
    case 'FILE':
      return {};
    case "FORM":
      return { 'Content-Type': 'application/x-www-form-urlencoded' };
    default:
      return { 'Content-Type': 'application/json' };
  }
}

function getBody({ contentType, bodyParams }: BodyOptions) {
  switch (contentType) {
    case 'FILE':
      return bodyParams as FormData;
    case 'FORM':
      return getUrlEncodedData(bodyParams as UrlParams);
    default:
      return JSON.stringify(bodyParams);
  }
}

function getUrlEncodedData(bodyParams: UrlParams) {
  return Object.keys(bodyParams)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(bodyParams[key]))
    .join('&');
}
