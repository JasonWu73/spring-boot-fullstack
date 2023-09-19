import React from "react";
import classNames from "classnames";

type Variant = "primary" | "danger" | "light";
type Size = "sm" | "md" | "lg";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  label?: React.ReactNode;
  variant?: Variant;
  size?: Size;
};

/**
 * Button 组件用于渲染一个按钮, 支持原生 HTML `button` 属性.
 *
 * @param ButtonProps - 按钮组件的属性
 * @param ButtonProps.label - 按钮的内容, 如存在 `children` 值, 则会忽略该属性
 * @param ButtonProps.variant - 按钮的样式, 默认为 `primary`
 * @param ButtonProps.size - 按钮的尺寸, 默认为 `md`
 * @return 按钮组件
 */
export default function Button({
  label,
  variant = "primary",
  size = "md",
  children,
  className,
  ...rest
}: ButtonProps) {
  const commonClasses = "rounded shadow-sm focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed";
  const styleClasses = getStyleClasses(variant);
  const sizeClasses = getSizeClasses(size);

  return (
    <button className={classNames(commonClasses, styleClasses, sizeClasses, className)} {...rest}>
      {children ?? label}
    </button>
  );
}

function getStyleClasses(variant: Variant) {
  switch (variant) {
    case "danger":
      return "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-300";
    case "light":
      return "bg-slate-100 text-black hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-50";
    default:
      return "bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 focus:ring-sky-300";
  }
}

function getSizeClasses(size: Size) {
  switch (size) {
    case "sm":
      return "px-2 py-1 text-sm";
    case "lg":
      return "px-6 py-3 text-lg";
    default:
      return "px-4 py-2 text-base";
  }
}
