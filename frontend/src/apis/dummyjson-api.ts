import { get } from '../utils/http.ts';

type Error = {
  message: string;
};

type Product = {
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
 * 获取随机一个商品。
 *
 * @param signal `AbortController` 实例的 `signal` 属性，用于主动取消请求
 */
export async function getRandomProduct(signal?: AbortSignal): Promise<[Product | null, Error | null]> {
  const randomId = Math.floor(Math.random() * 110);
  const [data, error] = await get<Product, Error>({
    url: `https://dummyjson.com/products/${randomId}`,
    signal: signal
  });

  // 统一处理错误
  if (typeof error === 'string') {
    return [data, { message: error }];
  }

  return [data, error];
}