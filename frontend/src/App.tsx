import Button from './components/button/Button.tsx';
import { getRandomProduct } from './apis/dummyjson-api.ts';
import { useState } from 'react';

export default function App() {
  const [product, setProduct] = useState(''); // 商品信息
  const [counter, setCounter] = useState(0); // 商品获取数
  const [error, setError] = useState(''); // 错误信息
  const [loading, setLoading] = useState(false); // 加载中

  async function handleClick() {
    // 首先清空原错误信息
    setError('');

    // 开始加载数据
    setLoading(true);

    // 获取商品
    const [data, error] = await getRandomProduct();

    // 结束加载数据
    setLoading(false);

    // 判断商品是否加载成功
    if (data == null || error) {
      setError(error ? error.message : '获取商品失败');
      return;
    }

    setProduct(data.title);
    setCounter(prev => prev + 1);
  }

  return (
    <div className="mt-8 mx-8 p-4 rounded border shadow-sm">
      <h1 className={`font-bold tracking-wider ${error ? 'text-red-500' : ''}`}>
        {loading ? '加载中...' : error ? error : product ? product : '点击按钮获取商品标题'}
      </h1>
      <Button label="获取商品" onClick={handleClick} className="my-4" />
      <p>已加载 <strong>{counter}</strong> 个商品</p>
    </div>
  );
}
