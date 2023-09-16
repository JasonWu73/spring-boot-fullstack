import React from 'react';
import classNames from 'classnames';

type StyleType = 'primary' | 'danger' | 'light';

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  styleType?: StyleType;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Button 组件用于渲染一个按钮.
 *
 * @param ButtonProps - 按钮组件的属性
 * @param ButtonProps.children - 按钮的内容
 * @param ButtonProps.onClick - 单击按钮时调用的函数
 * @param ButtonProps.styleType - 按钮的样式, 默认为 `primary`
 * @param ButtonProps.type - 按钮的类型, 默认为 `button`
 * @param ButtonProps.disabled - 按钮是否被禁用
 * @param ButtonProps.className - 按钮的额外 CSS 类
 * @param ButtonProps.style - 按钮的额外 CSS 样式
 * @return 按钮组件
 */
export default function Button({
  children,
  onClick,
  styleType = 'primary',
  type = 'button',
  disabled,
  className,
  style
}: ButtonProps) {
  const commonClasses = 'px-4 py-2 text-sm rounded shadow-sm focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed';
  const styleClasses = getStyleClasses(styleType);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={classNames(commonClasses, styleClasses, className)}
    >
      {children}
    </button>
  );
}

function getStyleClasses(styleType: StyleType) {
  switch (styleType) {
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-300';
    case 'light':
      return 'bg-slate-100 text-black hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-50';
    default:
      return 'bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 focus:ring-sky-300';
  }
}
