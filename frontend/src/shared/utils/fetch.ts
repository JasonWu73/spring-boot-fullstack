import { endNProgress, startNProgress } from "@/shared/utils/nprogress";

type ContentType = "JSON" | "URLENCODED" | "FILE";
type Headers = Record<string, string>;
type UrlParams = Record<string, string | number | null | undefined>;
type BodyData = Record<string, unknown> | FormData;

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ApiRequest = {
  url: string;
  method?: Method;
  contentType?: ContentType;
  headers?: Headers;
  urlParams?: UrlParams;
  bodyData?: BodyData;
};

type ApiResponse<TData, TError> = {
  /**
   * HTTP 响应状态码。
   */
  status?: number;

  /**
   * API 响应结果。
   */
  data?: TData;

  /**
   * API 响应错误信息。
   *
   * <ul>
   *   <li>当类型为 `TError` 时，表示 API 响应的错误信息</li>
   *   <li>当类型为 `string` 时，表示请求发送失败时的错误信息</li>
   * </ul>
   */
  error?: TError | string;
};

/**
 * 发送 HTTP API 请求，并以 JSON 数据格式解析响应结果。
 * <p>
 * 不建议使用 `signal`（`AbortController`）实现中途放弃请求，因为这只会不易于前端 F12 调试（看不到响应内容），而后端仍然会处理请求。前端要做的事应该只是忽略请求的结果，而非中途放弃请求。
 *
 * <ul>
 *   <li>请求头中的 `Accept` 默认为 `application/json`</li>
 * </ul>
 *
 * @param options 请求配置项
 * @param options.url URL 地址
 * @param options.method 请求方法，默认为 `GET`
 * @param options.contentType 请求体的内容类型，默认为 `JSON`
 * @param options.headers HTTP 请求头
 * @param options.urlParams URL 参数
 * @param options.bodyData 请求体数据
 * @returns Promise<ApiResponse<TData, TError>> HTTP 响应结果或请求发送失败时的错误信息
 */
export async function sendRequest<TData, TError>({
  url,
  method = "GET",
  contentType = "JSON",
  headers = {},
  urlParams,
  bodyData,
}: ApiRequest): Promise<ApiResponse<TData, TError>> {
  try {
    const targetUrl = appendUrlParams(url, urlParams);

    startNProgress();

    const response = await fetch(targetUrl, {
      method,
      headers: getHeaders(headers, contentType),
      body: getBody(bodyData, contentType),
    });

    // 如果 HTTP 状态码为 204，表示请求成功，但无响应结果
    if (response.status === 204) {
      return { status: response.status };
    }

    // 以 JSON 数据格式解析请求
    const responseData = await response.json();

    // 请求失败时，返回异常响应结果
    if (!response.ok) {
      return { status: response.status, error: responseData };
    }

    return { status: response.status, data: responseData };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
  } finally {
    endNProgress();
  }
}

function appendUrlParams(url: string, urlParams?: UrlParams) {
  if (!urlParams) return url;

  const urlObj = new URL(url);

  Object.keys(urlParams).forEach((key) => {
    const value = urlParams[key];

    urlObj.searchParams.append(key, value ? String(value) : "");
  });

  return urlObj.toString();
}

function getHeaders(headers: Headers, contentType?: ContentType) {
  const jsonAcceptHeaders = {
    Accept: "application/json",
    ...headers,
  };

  const contentTypeValue = getContentTypeValue(contentType);

  if (!contentTypeValue) return jsonAcceptHeaders;

  return {
    ...jsonAcceptHeaders,
    "Content-Type": contentTypeValue,
  };
}

function getContentTypeValue(contentType?: ContentType) {
  switch (contentType) {
    case "FILE": {
      return undefined; // 不要设置 Content-Type，让浏览器自动设置
    }
    case "URLENCODED": {
      return "application/x-www-form-urlencoded";
    }
    case "JSON": {
      return "application/json";
    }
    default: {
      return undefined;
    }
  }
}

function getBody(bodyData?: BodyData, contentType?: ContentType) {
  if (!bodyData) return undefined;

  switch (contentType) {
    case "FILE": {
      return bodyData as FormData;
    }
    case "URLENCODED": {
      return getUrlEncodedData(bodyData as UrlParams);
    }
    case "JSON": {
      return JSON.stringify(bodyData);
    }
    default: {
      return undefined;
    }
  }
}

function getUrlEncodedData(bodyData: UrlParams) {
  return Object.keys(bodyData)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(bodyData[key] ?? "")}`,
    )
    .join("&");
}
