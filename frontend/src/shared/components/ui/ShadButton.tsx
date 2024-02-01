import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn, tw } from "@/shared/utils/helpers";

const buttonVariants = cva(
  tw`flex items-center justify-center rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300`,
  {
    variants: {
      variant: {
        default: tw`bg-sky-500 text-slate-50 shadow-sm hover:bg-sky-500/90 dark:bg-sky-600 dark:text-slate-50 dark:hover:bg-sky-600/90`,
        destructive: tw`bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-600 dark:text-slate-50 dark:hover:bg-red-600/90`,
        outline: tw`border border-slate-200 bg-transparent shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-50`,
        secondary: tw`bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80`,
        ghost: tw`hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50`,
        link: tw`text-slate-900 underline-offset-4 hover:underline dark:text-slate-50`,
      },
      size: {
        default: tw`h-9 px-4 py-2`,
        sm: tw`h-8 rounded px-3 text-xs`,
        lg: tw`h-10 rounded px-8`,
        icon: tw`h-9 w-9`,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const ShadButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
ShadButton.displayName = "Button";

export { ShadButton, buttonVariants };
