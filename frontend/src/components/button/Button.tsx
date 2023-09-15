import React from 'react';
import classNames from 'classnames';

type ButtonType = 'primary' | 'danger' | 'light';

type ButtonProps = {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  btn?: ButtonType;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
};

export default function Button(
  {
    label,
    onClick,
    btn = 'primary',
    type = 'button',
    disabled,
    className
  }: ButtonProps
) {
  const btnClass = getBtnClass(btn);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'px-4 py-2 text-sm rounded shadow-sm focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed',
        btnClass,
        className
      )}
    >
      {label}
    </button>
  );
}

function getBtnClass(btn: ButtonType) {
  const btnClass = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 focus:ring-sky-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-300',
    light: 'bg-slate-100 text-black hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-50'
  };

  return btnClass[btn] || btnClass.primary;
}
