import React, { useId } from "react";
import classNames from "classnames";
import { type Size } from "@/components/ui/types.ts";

type FormItemProps = React.ComponentPropsWithRef<"input"> & {
  label?: React.ReactNode;
  itemSize?: Size;
  labelClass?: string;
  inputClass?: string;
};

/**
 * 表单项组件, 支持原生 HTML `input` 属性.
 *
 * @param FormItemProps - 组件属性
 * @param FormItemProps.label - 标签内容, 如存在 `children` 值, 则会忽略该属性
 * @param FormItemProps.itemSize - 尺寸, 默认 `md`
 * @param FormItemProps.labelClass - 标签样式
 * @param FormItemProps.inputClass - 输入框样式
 * @return
 */
export default function FormItem({
  label,
  itemSize = "md",
  labelClass,
  inputClass,
  children,
  type = "text",
  ...rest
}: FormItemProps) {
  const id = useId();

  const sizeClasses = getSizeClasses(itemSize);

  return (
    <div
      className={classNames(
        "w-full flex justify-between items-center",
        {
          "gap-2": itemSize === "sm",
          "gap-4": itemSize !== "sm"
        }
      )}
    >
      <label htmlFor={id} className={classNames("min-w-[120px]", sizeClasses, labelClass)}>
        {children ?? label}
      </label>

      <input
        type={type}
        id={id}
        className={classNames(
          "flex-1 rounded shadow-sm border border-slate-400 focus:outline-none focus:ring focus:ring-sky-300",
          sizeClasses,
          inputClass
        )}
        {...rest} />
    </div>
  );
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
