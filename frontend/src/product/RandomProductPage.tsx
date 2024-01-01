import { Product } from "@/product/Product";
import { useTitle } from "@/shared/hooks/use-title";

export default function RandomProductPage() {
  useTitle("随机商品");

  return <Product />;
}
