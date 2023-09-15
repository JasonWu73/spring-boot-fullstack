import Button from './components/button/Button.tsx';
import { getRandomProduct, Product } from './apis/dummyjson-api.ts';
import { useEffect, useState } from 'react';

type ProductState = {
  loading: boolean;
  error: string;
  product: Product | null;
  counter: number;
};

type TitleProps = {
  label: string;
  isError?: boolean;
};

export default function App() {
  const { state, getProduct } = useProduct();

  const productContent = state.loading ? (
    <Title label="加载中..." />
  ) : state.error ? (
    <Title label={state.error} isError />
  ) : state.product && (
    <>
      <Title label={state.product.title} />

      <img
        src={state.product.thumbnail}
        alt={state.product.title}
        className="w-32 h-32 object-cover rounded-full border border-gray-300 shadow-sm"
      />
    </>
  );

  return (
    <div className="mt-8 mx-8 p-4 rounded border shadow-sm">
      {productContent}

      <Button
        label={`获取商品${state.loading ? '...' : ''}`}
        onClick={() => getProduct()}
        className="my-4"
        disabled={state.loading}
      />

      <p>已加载 <strong>{state.counter}</strong> 个商品</p>
    </div>
  );
}

function Title({ label, isError }: TitleProps) {
  return (
    <h1 className={`font-bold tracking-wider ${isError ? 'text-red-500' : ''}`}>
      {label}
    </h1>
  );
}

function useProduct() {
  const [state, setState] = useState<ProductState>({
    loading: false, // 加载中
    error: '', // 错误信息
    product: null, // 商品信息
    counter: 0 // 商品获取计数
  });

  // 首次进入页面时获取商品
  useEffect(() => {
    const controller = new AbortController();
    getProduct(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  async function getProduct(signal?: AbortSignal) {
    // 初始化加载状态
    setState(prev => ({ ...prev, loading: true, error: '' }));

    // 获取商品
    const [data, error] = await getRandomProduct(signal);

    setState(prev => ({ ...prev, loading: false }));

    if (error) {
      setState(prev => ({ ...prev, error: error.message }));
      return;
    }

    if (!data) {
      return;
    }

    setState(prev => ({ ...prev, product: data, counter: prev.counter + 1 }));
  }

  return { state, getProduct };
}