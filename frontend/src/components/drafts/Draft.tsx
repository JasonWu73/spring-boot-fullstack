import Button from "@/components/button/Button.tsx";
import React, { useState } from "react";
import classNames from "classnames";

type StepCardProps = {
  children: React.ReactNode;
};

const messages = [
  "Learn React ⚛️",
  "Apply for jobs 💼",
  "Invest your new income 🤑"
];

type StepNumberProps = {
  step: number;
};

type StepAction = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

export default function Draft() {
  return (
    <StepCard>
      <Step />
    </StepCard>
  );
}

function StepCard({ children }: StepCardProps) {
  return (
    <div className="w-96 mt-8 mx-auto border border-amber-500 bg-slate-200 rounded shadow-sm">
      {children}
    </div>
  );
}

function Step() {
  const [step, setStep] = useState(1);

  return (
    <div className="p-4 flex flex-col items-center justify-center gap-4">
      <StepNumber step={step} />
      <p>{`${step}. ${messages[step - 1]}`}</p>
      <StepAction setStep={setStep} />
    </div>
  );
}

function StepNumber({ step }: StepNumberProps) {
  return (
    <ul className="w-full flex justify-around">
      {[1, 2, 3].map((number) => (
        <li key={number}>
          <Button
            size="sm"
            className={classNames(
              "w-8 h-8 rounded-full",
              {
                "bg-sky-500": (step >= number),
                "bg-slate-400": (step < number)
              }
            )}
          >
            {number}
          </Button>
        </li>
      ))}
    </ul>
  );
}

function StepAction({ setStep }: StepAction) {
  function handlePrevious() {
    setStep(prev => {
      if (prev <= 1) {
        return prev;
      }

      return prev - 1;
    });
  }

  function handleNext() {
    setStep(prev => {
      if (prev >= 3) {
        return prev;
      }

      return prev + 1;
    });
  }

  return (
    <div className="w-full flex justify-around">
      <Button onClick={handlePrevious} size="sm">Previous</Button>
      <Button onClick={handleNext} size="sm">Next</Button>
    </div>
  );
}