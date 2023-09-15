import Button from './components/button/Button.tsx';
import { getRandomProduct, Product } from './apis/dummyjson-api.ts';
import { useEffect, useReducer } from 'react';

type ProductState = {
  isLoading: boolean;
  error: string;
  product: Product | null;
  count: number;
};

type Action =
  | { type: 'startLoading' }
  | { type: 'endLoading' }
  | { type: 'setError', payload: string }
  | { type: 'setProduct', payload: Product };

export default function App() {
  const { state, getProduct } = useProduct();

  const productContent = getProductContent(state);

  return (
    <div className="mt-8 mx-8 p-4 rounded border shadow-sm">
      {productContent}

      <Button
        label={`获取商品${state.isLoading ? '...' : ''}`}
        onClick={() => getProduct()}
        className="my-4"
        disabled={state.isLoading}
      />

      <Message count={state.count} />
    </div>
  );
}

function getProductContent(state: ProductState) {
  return state.isLoading ? (
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
}

type MessageProps = {
  count: ProductState['count'];
};

function Message({ count }: MessageProps) {
  return (
    <p>已加载 <strong>{count}</strong> 个商品</p>
  );
}

type TitleProps = {
  label: string;
  isError?: boolean;
};

function Title({ label, isError }: TitleProps) {
  return (
    <h1 className={`font-bold tracking-wider ${isError ? 'text-red-500' : ''}`}>
      {label}
    </h1>
  );
}

function useProduct() {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    error: '',
    product: null,
    count: 0 // 商品获取计数
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
    dispatch({ type: 'startLoading' });

    // 获取商品
    const { data, error } = await getRandomProduct(signal);

    dispatch({ type: 'endLoading' });

    if (error) {
      dispatch({ type: 'setError', payload: error.message });
      return;
    }

    if (data) {
      dispatch({ type: 'setProduct', payload: data });
    }
  }

  function reducer(state: ProductState, action: Action) {
    switch (action.type) {
      case 'startLoading':
        return { ...state, isLoading: true, error: '' };
      case "endLoading":
        return { ...state, isLoading: false };
      case 'setError':
        return { ...state, isLoading: false, error: action.payload };
      case 'setProduct':
        return { ...state, isLoading: false, error: '', product: action.payload, count: state.count + 1 };
      default:
        return state;
    }
  }

  return { state, getProduct };
}