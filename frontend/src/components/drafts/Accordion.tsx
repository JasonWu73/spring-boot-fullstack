import { useState } from "react";
import classNames from "classnames";

const questions = [
  {
    id: 1,
    question: "What is React?",
    answer: "A library for managing user interfaces."
  },
  {
    id: 2,
    question: "Where do you make Ajax requests in React?",
    answer: "The componentDidMount lifecycle event"
  },
  {
    id: 3,
    question: "How do you pass data to a React component?",
    answer: "You can pass data to a React component using props"
  }
];

type AccordionCardProps = {
  question: typeof questions[0];
};

export default function Accordion() {
  return (
    <div>
      {questions.map(question => (
        <AccordionCard key={question.id} question={question} />
      ))}
    </div>
  );
}

function AccordionCard({ question }: AccordionCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-1/3 mt-8 mx-auto p-4 border-t-4 border-t-green-600 shadow">
      <header
        onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}
        className="relative flex justify-center items-center cursor-pointer"
      >
        <h2
          className={classNames(
            "absolute left-4 text-2xl font-bold",
            {
              "text-slate-400": !isOpen,
              "text-green-600": isOpen
            }
          )}
        >
          {question.id}
        </h2>

        <h2 className="mx-8 text-2xl font-bold text-green-600 text-center">{question.question}</h2>

        <button className="absolute right-4 text-2xl font-bold">
          {isOpen ? "-" : "+"}
        </button>
      </header>

      {isOpen && (
        <div className="text-center">
          <p>{question.answer}</p>
        </div>
      )}
    </div>
  );
}