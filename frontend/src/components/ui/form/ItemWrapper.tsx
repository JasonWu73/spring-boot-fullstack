import React from "react";
import classNames from "classnames";
import { type Size } from "@/components/ui/types.ts";

type ItemWrapperProps = {
  itemSize?: Size;
  children: React.ReactNode;
};

export default function ItemWrapper({ itemSize, children }: ItemWrapperProps) {
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
      {children}
    </div>
  );
}
