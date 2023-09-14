import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export default function Button({ label, onClick, type = 'button', disabled, className }: ButtonProps) {
  const defaultClassName = 'px-4 py-2 text-sm bg-sky-500 text-white rounded shadow-sm hover:bg-sky-600 active:bg-sky-700 focus:outline-none focus:ring focus:ring-sky-300 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${defaultClassName} ${className}`}
    >
      {label}
    </button>
  );
}