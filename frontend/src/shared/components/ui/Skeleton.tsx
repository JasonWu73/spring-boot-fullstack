import React from "react";

import { cn } from "@/shared/utils/helpers";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-900/10 dark:bg-slate-500/50",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
