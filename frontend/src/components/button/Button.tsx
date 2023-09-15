import React from 'react';

type ButtonProps = {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  btn?: 'primary' | 'danger' | 'light';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
};

export default function Button({ label, onClick, btn = 'primary', type = 'button', disabled, className }: ButtonProps) {
  const btnClass = getBtnClass(btn);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-sm rounded shadow-sm focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed ${btnClass} ${className}`}
    >
      {label}
    </button>
  );
}

function getBtnClass(btn: ButtonProps['btn']) {
  switch (btn) {
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-300';
    case 'light':
      return 'bg-slate-200 text-black hover:bg-slate-300 active:bg-slate-400 focus:ring-slate-100';
    default:
      return 'bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 focus:ring-sky-300';
  }
}
