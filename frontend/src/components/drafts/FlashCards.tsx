import { useState } from "react";
import classNames from "classnames";

const questions = [
  {
    id: 1,
    question: "What is the capital of France?",
    answer: "Paris"
  },
  {
    id: 2,
    question: "What is the capital of Germany?",
    answer: "Berlin"
  },
  {
    id: 3,
    question: "What is the capital of Italy?",
    answer: "Rome"
  },
  {
    id: 4,
    question: "What is the capital of Spain?",
    answer: "Madrid"
  },
  {
    id: 5,
    question: "What is the capital of Japan?",
    answer: "Tokyo"
  },
  {
    id: 6,
    question: "What is the capital of China?",
    answer: "Beijing"
  }
];

type CardProps = {
  question: typeof questions[0];
  isAnswer: boolean;
  onClick: (id: number) => void;
};

export default function FlashCards() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  function handleToggleQuestion(id: number) {
    setSelectedId(prev => {
      if (prev === id) {
        return null;
      }

      return id;
    });
  }

  console.log("rendered");

  return (
    <ul className="m-8 flex flex-wrap justify-center gap-8">
      {questions.map(task => (
        <Card key={task.id} question={task} isAnswer={task.id === selectedId} onClick={handleToggleQuestion} />
      ))}
    </ul>
  );
}

function Card({ question, isAnswer, onClick }: CardProps) {
  return (
    <li
      onClick={() => onClick(question.id)}
      className={classNames(
        "w-1/4 h-48 p-4 border border-gray-400 rounded shadow-sm flex items-center justify-center cursor-pointer",
        {
          "bg-gray-100": !isAnswer,
          "bg-red-500": isAnswer
        }
      )}
    >
      <p
        className={classNames(
          "text-lg font-bold",
          { "text-black": !isAnswer, "text-slate-100": isAnswer }
        )}
      >
        {isAnswer ? question.answer : question.question}
      </p>
    </li>
  );
}
