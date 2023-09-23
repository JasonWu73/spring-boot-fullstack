import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useFormField } from "@/components/ui/Form.tsx";

/**
 * {@link https://ui.shadcn.com/docs/components/input|Input - shadcn/ui}
 */
const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400",
        !error && "border-slate-200 dark:border-slate-800 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300",
        error && "border-red-500 dark:border-red-900 focus-visible:ring-red-500 dark:focus-visible:ring-red-600",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
