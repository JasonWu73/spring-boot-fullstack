import React, { useId } from "react";
import { type Size } from "@/components/ui/types.ts";
import ItemWrapper from "@/components/ui/form/ItemWrapper.tsx";
import classNames from "classnames";
import { getSizeClasses } from "@/components/ui/classes.ts";

type Option = {
  value: string;
  label: React.ReactNode;
};

type SelectItemProps = React.ComponentPropsWithRef<"select"> & {
  options: Option[];
  label?: React.ReactNode;
  itemSize?: Size;
  labelClass?: string;
  selectClass?: string;
};

export default function SelectItem({
  options,
  label,
  itemSize = "md",
  labelClass,
  selectClass,
  children,
  ...rest
}: SelectItemProps) {
  const id = useId();

  const sizeClasses = getSizeClasses(itemSize);

  return (
    <ItemWrapper>
      <label htmlFor={id} className={classNames("min-w-[120px]", sizeClasses, labelClass)}>
        {children ?? label}
      </label>

      <select
        id={id}
        className={classNames(
          "flex-1 rounded shadow-sm border border-slate-400 focus:outline-none focus:ring focus:ring-sky-300",
          sizeClasses,
          selectClass
        )}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </ItemWrapper>
  );
}
