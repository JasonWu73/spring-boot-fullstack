import Button from './components/button/Button.tsx';
import { getRandomProduct } from './apis/dummyjson-api.ts';
import { useEffect, useState } from 'react';

export default function App() {
  const { state, getProduct } = useProduct();

  async function handleClick() {
    await getProduct();
  }

  return (
    <div className="mt-8 mx-8 p-4 rounded border shadow-sm">
      <h1 className={`font-bold tracking-wider ${state.error ? 'text-red-500' : ''}`}>
        {state.loading ? '加载中...' : state.error || state.product}
      </h1>
      <Button label="获取商品" onClick={handleClick} className="my-4" />
      <p>已加载 <strong>{state.counter}</strong> 个商品</p>
    </div>
  );
}

function useProduct() {
  const [state, setState] = useState({
    loading: false, // 加载中
    error: '', // 错误信息
    product: '', // 商品名称
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

    setState(prev => ({ ...prev, product: data.title, counter: prev.counter + 1 }));
  }

  return { state, getProduct };
}