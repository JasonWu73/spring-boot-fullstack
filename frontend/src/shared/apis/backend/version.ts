import { requestApi } from "@/shared/apis/backend/helpers";

type Version = {
  name: string;
  version: string;
  developer: string;
  builtAt: string;
};

/**
 * 获取版本信息。
 *
 * @returns Promise 响应结果
 */
export async function getVersionApi() {
  return await requestApi<Version>({
    url: "/api/v1/public/version",
  });
}
