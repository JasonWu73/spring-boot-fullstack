import type { AuthResponse } from "@/shared/apis/backend/auth";
import { clearAuth, getAuth, setAuth } from "@/shared/auth/auth-signals";
import { sendRequest, type ApiRequest } from "@/shared/utils/fetch";

// 这里假设 Vite 运行时使用默认的 5173 端口
const DEV_PORT = "5173";
// 后台服务的端口号为 8080
const DEV_BACKEND_PORT = "8080";

const DEV_BACKEND_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${DEV_BACKEND_PORT}`;

const PROD_BACKEND_BASE_URL = `${window.location.origin}`;

const BASE_URL =
  window.location.port === DEV_PORT
    ? DEV_BACKEND_BASE_URL
    : PROD_BACKEND_BASE_URL;

/**
 * 后端 API 在请求失败时返回的错误数据类型。
 */
type ApiError = {
  timestamp: string;
  status: number;
  error: string;
  path: string;
};

/**
 * 后端对访问令牌的有效期，单位为：秒。
 */
const TOKEN_EXPIRES_IN_SECONDS = 30 * 60;

/**
 * 向后端服务发送 API 请求。
 * <p>
 * 使用此方法发送请求，会自动处理以下情况：
 *
 * <ul>
 *   <li>当访问令牌存在时，会自动添加到请求头中</li>
 *   <li>当访问令牌快过期时，会自动刷新访问令牌</li>
 *   <li>当访问令牌过期时，会自动退出登录</li>
 * </ul>
 *
 * @param request 请求配置项
 * @returns Promise<ApiResponse<T>> API 响应结果
 */
export async function requestApi<T>(request: ApiRequest) {
  const auth = getAuth();

  if (!auth) return await requestBackendApi<T>(request);

  const { expiredAt, accessToken } = auth;

  const response = await requestBackendApi<T>({
    ...request,
    headers: { ...request.headers, Authorization: `Bearer ${accessToken}` },
  });

  // 判断是否需要重新登录
  if (response.status === 401) {
    clearAuth();
    return { status: response.status, error: "登录过期" };
  }

  // 为了测试和发现问题，故意设置 60 秒后就刷新访问令牌
  if (expiredAt - Date.now() < (TOKEN_EXPIRES_IN_SECONDS - 60) * 1000) {
    await refreshAuth();
  }

  return response;
}

// 上次刷新访问令牌的时间，用于避免因异步触发而导致可能的重复刷新问题
let refreshedAt = 0;

/**
 * 刷新访问令牌的间隔时间，单位为：秒。
 */
const REFRESH_INTERVAL_SECONDS = 30;

async function refreshAuth() {
  const auth = getAuth();

  if (!auth) return;

  // 在 `REFRESH_INTERVAL_SECONDS` 秒内，不重复刷新
  if (Date.now() - refreshedAt < REFRESH_INTERVAL_SECONDS * 1000) return;

  refreshedAt = Date.now();

  const { accessToken, refreshToken } = auth;

  const { data, error } = await requestBackendApi<AuthResponse>({
    url: `/api/v1/auth/refresh/${refreshToken}`,
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (error) {
    clearAuth();
    return;
  }

  if (data) {
    setAuth(data);
  }
}

async function requestBackendApi<T>(request: ApiRequest) {
  const { status, data, error } = await sendRequest<T, ApiError>({
    ...request,
    url: `${BASE_URL}${request.url}`,
  });

  if (error) {
    return { status, error: typeof error === "string" ? error : error.error };
  }

  return { status, data };
}
