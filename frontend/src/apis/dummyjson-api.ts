import { sendRequest } from "@/utils/http.ts";

type ApiError = {
  message: string;
};

type ApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
};

export type ProductItem = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

export async function getRandomProduct(signal?: AbortSignal): Promise<ApiResponse<ProductItem>> {
  const randomId = Math.floor(Math.random() * 110);
  const { data, error } = await sendRequest<ProductItem, ApiError>({
    url: `https://dummyjson.com/products/${randomId}`,
    signal: signal
  });

  // 统一处理错误
  if (typeof error === "string") {
    return { data, error: { message: error } };
  }

  return { data, error };
}
