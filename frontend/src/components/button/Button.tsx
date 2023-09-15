import React from 'react';
import classNames from 'classnames';

type ButtonType = 'primary' | 'danger' | 'light';

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  btn?: ButtonType;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
};

/**
 * 使用可定制的属性渲染按钮组件。
 *
 * @param ButtonProps - 按钮组件的属性
 * @param ButtonProps.children - 按钮的内容
 * @param ButtonProps.onClick - 单击按钮时调用的函数
 * @param ButtonProps.btn - 按钮的类型（默认值为 `primary`）
 * @param ButtonProps.type - 按钮元素的类型（默认值为 `button`）
 * @param ButtonProps.disabled - 指示按钮是否被禁用
 * @param ButtonProps.className - 按钮的附加 CSS 类
 * @return 渲染的按钮组件
 */
export default function Button({
  children,
  onClick,
  btn = 'primary',
  type = 'button',
  disabled,
  className
}: ButtonProps) {
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
      {children}
    </button>
  );
}

function getBtnClass(btn: ButtonType) {
  switch (btn) {
    case "danger":
      return 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-300';
    case "light":
      return 'bg-slate-100 text-black hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-50';
    default:
      return 'bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 focus:ring-sky-300';
  }
}
