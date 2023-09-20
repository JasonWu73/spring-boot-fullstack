import Button from "@/components/button/Button.tsx";
import { useState } from "react";

export default function DateCounter() {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);

  const timestamp = new Date().setDate(new Date().getDate() + count);
  const dateStr = new Date(timestamp).toDateString();

  const isCanReset = count !== 0 || step !== 1;

  return (
    <div className="mt-8 mx-auto py-4 w-96 min-h-44 border border-amber-500 shadow-sm rounded flex flex-col items-center gap-4">
      <div>
        <input value={step} onChange={(e) => setStep(Number(e.target.value))} type="range" min={0} max={10} />
        <span className="ml-3 text-lg">{step}</span>
      </div>

      <div className="flex items-center justify-center">
        <Button onClick={() => setCount(count - step)} label="-" className="h-10 rounded-r-none" />
        <input
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          type="number"
          className="h-10 px-4 py-2 border border-slate-400 focus:outline-none focus:ring focus:border-sky-500"
        />
        <Button onClick={() => setCount(count + step)} label="+" className="h-10 rounded-l-none" />
      </div>

      <p>
        {count === 0 && `Today is ${dateStr}`}
        {count > 0 && `${count} day${count > 1 ? "s" : ""} after today is ${dateStr}`}
        {count < 0 && `${count} day${Math.abs(count) > 1 ? "s" : ""} before today was ${dateStr}`}
      </p>

      {isCanReset && (
        <Button
          onClick={() => {
            setStep(1);
            setCount(0);
          }}
        >
          Reset
        </Button>
      )}
    </div>
  );
}
