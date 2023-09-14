type Request = {
  url: string,
  params?: { [key: string]: string | number | boolean }
};

/**
 * 发送 GET 请求。
 *
 * @param url 请求地址
 * @param params URL 请求参数
 */
export async function get<T, E>({ url, params }: Request): Promise<[T | null, E | null]> {
  // 使用 URLSearchParams 处理 GET 参数
  const urlObj = new URL(url);
  if (params) {
    Object.keys(params).forEach(key => urlObj.searchParams.append(key, params[key].toString()));
  }

  const response = await fetch(urlObj.toString());
  const data = await response.json();

  if (!response.ok) {
    return [null, data];
  }

  return [data, null];
}