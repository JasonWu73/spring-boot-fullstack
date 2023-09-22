import { getRandomProduct, type Product } from "@/apis/dummyjson/product.ts";
import { useEffect, useReducer } from "react";
import classNames from "classnames";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/Button.tsx";

// noinspection JSUnusedGlobalSymbols
export default function ProductShowcase() {
  const { state, getProduct } = useProduct();

  function getProductContent() {
    if (state.isLoading) {
      return <Title label="加载中..." />;
    }

    if (state.error) {
      return <Title label={state.error} isError />;
    }

    if (state.product) {
      return (
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
  }

  return (
    <div className="mt-8 mx-8 p-4 rounded border shadow-sm">
      {getProductContent()}

      <Button onClick={() => getProduct()} className="my-4" disabled={state.isLoading}>
        {state.isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        获取商品
      </Button>

      <Message count={state.count} />
    </div>
  );
}

type TitleProps = {
  label: string;
  isError?: boolean;
};

function Title({ label, isError = false }: TitleProps) {
  return (
    <h1
      className={classNames(
        "font-bold tracking-wider",
        { "text-red-500": isError }
      )}
    >
      {label}
    </h1>
  );
}

type MessageProps = {
  count: State["count"];
};

function Message({ count }: MessageProps) {
  return (
    <p>已加载 <strong>{count}</strong> 个商品</p>
  );
}

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

function useProduct() {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    error: "",
    product: null,
    count: 0 // 商品获取计数
  });

  useEffect(() => {
    const controller = new AbortController();
    getProduct(controller.signal).then();

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
