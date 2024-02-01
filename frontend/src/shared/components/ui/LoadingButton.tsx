import { ReloadIcon } from "@radix-ui/react-icons";
import type { VariantProps } from "class-variance-authority";
import React from "react";

import { ShadButton, buttonVariants } from "@/shared/components/ui/ShadButton";

type LoadingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading: boolean;
    children: React.ReactNode;
  };

export default function LoadingButton({
  loading,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <ShadButton disabled={loading} {...props}>
      {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </ShadButton>
  );
}
