import Button from "@/components/button/Button.tsx";
import React from "react";
import classNames from "classnames";

type StepCardProps = {
  children: React.ReactNode;
};

const messages = [
  "Learn React ⚛️",
  "Apply for jobs 💼",
  "Invest your new income 🤑"
];

type Step = 1 | 2 | 3;

type StepNumberProps = {
  step: Step;
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
  // const [step, setStep] = useState<Step>(1);
  // setStep(2);
  const step = 2;

  return (
    <div className="p-4 flex flex-col items-center justify-center gap-4">
      <StepNumber step={step} />
      <p>{`${step}. ${messages[step - 1]}`}</p>
      <StepAction />
    </div>
  );
}

function StepNumber({ step }: StepNumberProps) {
  return (
    <ul className="w-full flex justify-around">
      {[1, 2, 3].map((number) => (
        <li key={number}>
          <Button
            size="sm" className={classNames(
            "w-8 h-8 rounded-full",
            {
              "bg-sky-500 text-slate-50": (step >= number),
              "bg-slate-50 text-slate-500": (step < number)
            }
          )}
          >{number}</Button>
        </li>
      ))}
    </ul>
  );
}

function StepAction() {
  return (
    <div className="w-full flex justify-around">
      <Button size="sm">Previous</Button>
      <Button size="sm">Next</Button>
    </div>
  );
}