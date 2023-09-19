import Button from "@/components/button/Button.tsx";
import React, { useState } from "react";

type CriteriaProps = {
  type: "step" | "count";
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

export default function Draft() {
  return (
    <div>
      <Counter />
    </div>
  );
}

function Counter() {
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(0);
  const days = count * step;
  const timestamp = new Date().setDate(new Date().getDate() + days);
  const dateStr = new Date(timestamp).toDateString();

  return (
    <div className="w-96 mt-8 mx-auto p-4 rounded border border-amber-500 shadow-sm flex flex-col items-center justify-center gap-4 dark:text-slate-300">
      <Criteria count={step} setCount={setStep} type="step" />
      <Criteria count={count} setCount={setCount} type="count" />

      {days === 0 && `Today is ${dateStr}`}
      {days < 0 && `${-days} days ago was ${dateStr}`}
      {days > 0 && `${days} days after is ${dateStr}`}
    </div>
  );
}

function Criteria({ type, count, setCount }: CriteriaProps) {
  return (
    <div className="w-full flex items-center justify-center gap-4">
      <Button onClick={() => setCount(prev => prev - 1)} label="-" />

      <span className="w-1/2 text-center">
        {type === "step" && "Step: "}
        {type === "count" && "Count: "}
        <span>{count}</span>
      </span>

      <Button onClick={() => setCount(prev => prev + 1)} label="+" />
    </div>);
}
