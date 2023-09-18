import { sendRequest } from "@/utils/http.ts";
import { type Product } from "@/apis/dummyjson/types.ts";

type ApiError = {
  message: string;
};

type ApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
};

export async function getRandomProduct(signal?: AbortSignal): Promise<ApiResponse<Product>> {
  const randomId = Math.floor(Math.random() * 110);
  const { data, error } = await sendRequest<Product, ApiError>({
    url: `https://dummyjson.com/products/${randomId}`,
    signal: signal
  });

  // 统一处理错误
  if (typeof error === "string") {
    return { data, error: { message: error } };
  }

  return { data, error };
}
