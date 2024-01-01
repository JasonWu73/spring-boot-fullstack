import { sendRequest, type ApiRequest } from "@/shared/utils/fetch";

const BASE_URL = "https://dummyjson.com";

type ApiError = {
  message: string;
  name?: string;
  expiredAt?: string;
};

/**
 * 向 Dummy Json 服务发送 API 请求。
 *
 * @param request 请求配置项
 * @returns Promise<ApiResponse<T>> API 响应结果
 */
export async function requestDummyJsonApi<T>(request: ApiRequest) {
  const { status, data, error } = await sendRequest<T, ApiError>({
    ...request,
    url: `${BASE_URL}${request.url}`,
  });

  if (error) {
    return { status, error: typeof error === "string" ? error : error.message };
  }

  return { status, data };
}
