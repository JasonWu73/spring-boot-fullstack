import { requestDummyJsonApi } from "@/shared/apis/dummyjson/helpers";

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
 * 获取商品详情。
 *
 * @param productId 要获取的商品 ID
 * @returns Promise 响应结果
 */
export async function getProductApi(productId: number) {
  return await requestDummyJsonApi<Product>({
    url: `/products/${productId}`,
  });
}
