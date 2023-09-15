type Request = {
  url: string;
  params?: { [key: string]: string | number | boolean };
  signal?: AbortSignal;
};

/**
 * 发送 GET 请求。
 *
 * @param url 请求地址
 * @param params URL 请求参数
 * @param signal `AbortController` 实例的 `signal` 属性，用于主动取消请求
 */
export async function get<T, E>({ url, params, signal }: Request): Promise<[T | null, E | string | null]> {
  try { // 使用 URLSearchParams 处理 GET 参数
    const urlObj = new URL(url);
    if (params) {
      Object.keys(params).forEach(key => urlObj.searchParams.append(key, params[key].toString()));
    }

    const response = await fetch(urlObj.toString(), {
      signal: signal
    });
    const data = await response.json();

    if (!response.ok) {
      return [null, data];
    }

    return [data, null];
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return [null, null];
    }

    return [null, error + ''];
  }
}