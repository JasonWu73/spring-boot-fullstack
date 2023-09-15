type Request = {
  url: string;
  params?: { [key: string]: string | number | boolean };
  signal?: AbortSignal;
};

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
export async function getJson<T, E>({ url, params, signal }: Request): Promise<Response<T, E>> {
  try {
    // 使用 URLSearchParams 处理 GET 参数
    const urlObj = new URL(url);
    if (params) {
      appendParamsToUrl(urlObj, params);
    }

    const response = await fetch(urlObj.toString(), { signal });
    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data };
    }

    return { data, error: null };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { data: null, error: null };
    }

    return { data: null, error: error + '' };
  }
}

function appendParamsToUrl(urlObj: URL, params: { [key: string]: string | number | boolean }) {
  Object.keys(params).forEach(key => urlObj.searchParams.append(key, params[key].toString()));
}
