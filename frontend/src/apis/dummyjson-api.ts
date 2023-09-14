import { get } from '../utils/http.ts';

type Product = {
  id: number,
  title: string,
  description: string,
  price: number,
  discountPercentage: number,
  rating: number,
  stock: number,
  brand: string,
  category: string,
  thumbnail: string,
  images: string[]
};

type Error = {
  message: string
}

/**
 * 获取随机一个商品。
 */
export async function getRandomProduct(): Promise<[Product | null, Error | null]> {
  const randomId = Math.floor(Math.random() * 110);
  return await get<Product, Error>({ url: `https://dummyjson.com/products/${randomId}` });
}