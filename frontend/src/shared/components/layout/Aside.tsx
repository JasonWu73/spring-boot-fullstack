import React from "react";

import { SideNavbar } from "@/shared/components/layout/SideNavbar";
import { cn } from "@/shared/utils/helpers";

type AsideProps = React.ComponentPropsWithoutRef<"header">;

export function Aside({ className, ...props }: AsideProps) {
  return (
    <aside
      className={cn("bg-night-1 p-4 text-snow dark:bg-night-1", className)}
      {...props}
    >
      <SideNavbar />
    </aside>
  );
}
