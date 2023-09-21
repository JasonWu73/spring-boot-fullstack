import React, { useState } from "react";
import Button from "@/components/button/Button.tsx";

type InputItemProps = {
  children: React.ReactNode;
};

type LikeSelectorProps = {
  percent: number;
  onChange: (percent: number) => void;
};

type MessageProps = { amount: number, tipPercent: number };

export default function TipCalculator() {
  const [amount, setAmount] = useState(0);
  const [myTipPercent, setMyTipPercent] = useState(0);
  const [friendPercent, setFriendPercent] = useState(0);

  const tipPercent = (myTipPercent + friendPercent) / 2;

  return (
    <div className="w-1/2 mt-8 mx-auto p-4 text-center border border-amber-500 shadow-sm rounded">
      <h1 className="mb-4 text-4xl font-extrabold tracking-widest uppercase text-gray-800 dark:text-slate-50">
        Tip Calculator
      </h1>

      <section className="flex flex-col justify-center items-center gap-4">
        <InputItem>
          <p className="dark:text-slate-50">How much was the bill?</p>
          <input
            value={amount ? amount : ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            type="number"
            className="border border-slate-400 rounded focus:outline-none focus:ring focus:border-sky-500 px-4"
          />
        </InputItem>


        <InputItem>
          <p className="dark:text-slate-50">How did you like the service?</p>
          <LikeSelector percent={myTipPercent} onChange={(percent) => setMyTipPercent(percent)} />
        </InputItem>


        <InputItem>
          <p className="dark:text-slate-50">How did your fried like the service?</p>
          <LikeSelector percent={friendPercent} onChange={(percent) => setFriendPercent(percent)} />
        </InputItem>
      </section>

      <Message amount={amount} tipPercent={tipPercent} />

      <Button
        label="reset"
        onClick={() => {
          setAmount(0);
          setMyTipPercent(0);
          setFriendPercent(0);
        }}
      />
    </div>
  );
}

function InputItem({ children }: InputItemProps) {
  return (
    <div className="w-full flex justify-center items-center gap-4">
      {children}
    </div>
  );
}

function LikeSelector({ percent, onChange }: LikeSelectorProps) {
 
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    onChange(Number(event.target.value));
  }

  return (
    <select
      value={percent}
      onChange={handleChange}
      className="border border-slate-400 rounded focus:outline-none focus:ring focus:border-sky-500 px-4"
    >
      <option value={0}>Dissatisfied (0%)</option>
      <option value={0.05}>It was okay (5%)</option>
      <option value={0.1}>It was good (10%)</option>
      <option value={0.2}>Absolutely amazing! (20%)</option>
    </select>
  );
}

function Message({ amount, tipPercent }: MessageProps) {
  const tip = Number((amount * tipPercent).toFixed(1));

  return (
    <div>
      <h2 className="text-2xl font-bold text-center my-4 text-gray-800 dark:text-slate-50">
        You pay ${amount + tip} (${amount} + ${tip} tip)
      </h2>
    </div>
  );
}