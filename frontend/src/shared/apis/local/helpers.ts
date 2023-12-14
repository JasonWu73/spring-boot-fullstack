import { sendRequest, type ApiRequest } from '@/shared/utils/fetch'

const BASE_URL = `${window.location.origin}`

/**
 * 请求前端本的 JSON 文件。
 *
 * @param request 请求配置项
 * @returns Promise<ApiResponse<T>> API 响应结果
 */
export async function requestLocalApi<T>(request: ApiRequest) {
  const { status, data, error } = await sendRequest<T, string>({
    ...request,
    url: `${BASE_URL}${request.url}`
  })

  if (error) return { status, error }

  return { status, data }
}
