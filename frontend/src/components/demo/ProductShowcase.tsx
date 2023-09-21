import Button from "@/components/ui/Button.tsx";
import { getRandomProduct } from "@/apis/dummyjson/product.ts";
import { useEffect, useReducer } from "react";
import classNames from "classnames";
import { type Product } from "@/apis/dummyjson/types.ts";

type State = {
  isLoading: boolean;
  error: string;
  product: Product | null;
  count: number;
};

type Action =
  | { type: "startLoading" }
  | { type: "endLoading" }
  | { type: "setError", payload: string }
  | { type: "setProduct", payload: Product };

type TitleProps = {
  label: string;
  isError?: boolean;
};

type MessageProps = {
  count: State["count"];
};

export default function ProductShowcase() {
  const { state, getProduct } = useProduct();

  return (
    <div className="mt-8 mx-8 p-4 rounded border shadow-sm">
      {getProductContent(state)}

      <Button onClick={() => getProduct()} className="my-4" disabled={state.isLoading}>
        {`获取商品${state.isLoading ? "..." : ""}`}
      </Button>

      <Message count={state.count} />
    </div>
  );
}

function getProductContent({ isLoading, error, product }: State) {
  if (isLoading) {
    return <Title label="加载中..." />;
  }

  if (error) {
    return <Title label={error} isError />;
  }

  if (product) {
    return (
      <>
        <Title label={product.title} />
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-32 h-32 object-cover rounded-full border border-gray-300 shadow-sm"
        />
      </>
    );
  }
}

function Title({ label, isError = false }: TitleProps) {
  const commonClasses = "font-bold tracking-wider";
  const errorClass = { "text-red-500": isError };

  return (
    <h1 className={classNames(commonClasses, errorClass)}>
      {label}
    </h1>
  );
}

function Message({ count }: MessageProps) {
  return (
    <p>已加载 <strong>{count}</strong> 个商品</p>
  );
}

function useProduct() {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    error: "",
    product: null,
    count: 0 // 商品获取计数
  });

  useEffect(() => {
    const controller = new AbortController();
    getProduct(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  async function getProduct(signal?: AbortSignal) {
    dispatch({ type: "startLoading" });

    const { data, error } = await getRandomProduct(signal);

    dispatch({ type: "endLoading" });

    if (error) {
      dispatch({ type: "setError", payload: error.message });
      return;
    }

    if (data) {
      dispatch({ type: "setProduct", payload: data });
    }
  }

  return { state, getProduct };
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "startLoading":
      return { ...state, isLoading: true, error: "" };
    case "endLoading":
      return { ...state, isLoading: false };
    case "setError":
      return { ...state, isLoading: false, error: action.payload };
    case "setProduct":
      return { ...state, isLoading: false, error: "", product: action.payload, count: state.count + 1 };
    default:
      return state;
  }
}
