import React from "react";
import classNames from "classnames";
import { type Size } from "@/components/ui/types.ts";
import { getSizeClasses } from "@/components/ui/classes.ts";

type Variant = "primary" | "danger" | "light";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  label?: React.ReactNode;
  variant?: Variant;
  size?: Size;
};

/**
 * Button 组件用于渲染一个按钮, 支持原生 HTML `button` 属性.
 *
 * @param ButtonProps - 组件属性
 * @param ButtonProps.label - 内容, 如存在 `children` 值, 则会忽略该属性
 * @param ButtonProps.variant - 样式, 默认为 `primary`
 * @param ButtonProps.size - 尺寸, 默认为 `md`
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
  const styleClasses = getStyleClasses(variant);
  const sizeClasses = getSizeClasses(size);

  return (
    <button
      className={classNames(
        "rounded shadow-sm focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed",
        styleClasses,
        sizeClasses,
        className
      )}
      {...rest}
    >
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
