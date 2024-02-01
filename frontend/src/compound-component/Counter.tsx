/**
 * 复合组件模式。
 */
import React from "react";

import { ShadButton } from "@/shared/components/ui/ShadButton";
import { cn } from "@/shared/utils/helpers";

// 1. 创建 Context
type CounterProviderState = {
  counter: number;
  increase: () => void;
  decrease: () => void;
};

const CounterProviderContext = React.createContext(
  undefined as unknown as CounterProviderState,
);

// 2.创建父组件
type CounterProviderProps = {
  children: React.ReactNode;
  className?: string;
};

// 作为复合组件的父组件，这里无需命名为 `CounterProvider`，因为并不会在组件外使用其 Context
export function Counter({ children, className }: CounterProviderProps) {
  const [counter, setCounter] = React.useState(0);

  const value: CounterProviderState = {
    counter,
    increase: () => setCounter((prevCounter) => prevCounter + 1),
    decrease: () => setCounter((prevCounter) => prevCounter - 1),
  };

  return (
    <CounterProviderContext.Provider value={value}>
      <div className={className}>{children}</div>
    </CounterProviderContext.Provider>
  );
}

function useCounter() {
  const context = React.useContext(CounterProviderContext);

  if (context === undefined) {
    throw new Error("useCounter 必须在 CounterProvider 中使用");
  }

  return context;
}

// 3. 创建子组件，实现常用功能
type CountProps = {
  className?: string;
};

function Count({ className }: CountProps) {
  const { counter } = useCounter();

  return <span className={className}>{counter}</span>;
}

type LabelProps = {
  children: React.ReactNode;
  className?: string;
};

function Label({ children, className }: LabelProps) {
  return <div className={cn("inline-block", className)}>{children}</div>;
}

type IncreaseOrDecreaseProps = {
  icon: React.ReactNode | string;
  className?: string;
};

function Increase({ icon, className }: IncreaseOrDecreaseProps) {
  const { increase } = useCounter();

  return (
    <ShadButton
      variant="outline"
      size="icon"
      onClick={increase}
      className={className}
    >
      {icon}
    </ShadButton>
  );
}

function Decrease({ icon, className }: IncreaseOrDecreaseProps) {
  const { decrease } = useCounter();

  return (
    <ShadButton
      variant="outline"
      size="icon"
      onClick={decrease}
      className={className}
    >
      {icon}
    </ShadButton>
  );
}

// 4. 将子组件作为父组件的属性
Counter.Count = Count;
Counter.Label = Label;
Counter.Increase = Increase;
Counter.Decrease = Decrease;
