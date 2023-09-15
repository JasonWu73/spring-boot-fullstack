import { sendRequest } from '@/utils/http.ts';

type ApiError = {
  message: string;
};

type ApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
};

export type Product = {
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

/**
 * 从 API 检索随机产品。
 *
 * @param signal - `AbortController` 实例的 `signal` 属性，用于主动取消请求
 * @return 解析为包含产品数据或错误的 `ApiResponse` 对象的 `Promise`
 */
export async function getRandomProduct(signal?: AbortSignal): Promise<ApiResponse<Product>> {
  const randomId = Math.floor(Math.random() * 110);
  const { data, error } = await sendRequest<Product, ApiError>({
    url: `https://dummyjson.com/products/${randomId}`,
    signal: signal
  });

  // 统一处理错误
  if (typeof error === 'string') {
    return { data, error: { message: error } };
  }

  return { data, error };
}