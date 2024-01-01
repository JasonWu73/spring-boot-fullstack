import { CircleUserRound, LayoutDashboard } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import { LoginButton } from "@/shared/components/layout/top-nav-bar/LoginButton";
import { LogoutButton } from "@/shared/components/layout/top-nav-bar/LogoutButton";
import { buttonVariants } from "@/shared/components/ui/Button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/shared/components/ui/NavigationMenu";
import { getAuth, hasAdmin } from "@/shared/auth/auth-signals";
import { cn } from "@/shared/utils/helpers";

export function AuthSwitch() {
  const location = useLocation();

  if (location.pathname === "/login") return null;

  const auth = getAuth();

  if (!auth) return <LoginButton />;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            onPointerMove={(event) => event.preventDefault()}
            onPointerLeave={(event) => event.preventDefault()}
            className="text-night hover:bg-slate-300 hover:text-night focus:bg-slate-300 focus:text-night data-[active]:bg-slate-300 data-[state=open]:bg-slate-300 dark:text-snow dark:hover:bg-night-2 dark:hover:text-snow dark:focus:bg-night-2 dark:focus:text-snow dark:data-[active]:bg-night-2 dark:data-[state=open]:bg-night-2"
          >
            {auth.nickname}
          </NavigationMenuTrigger>

          <NavigationMenuContent
            onPointerEnter={(event) => event.preventDefault()}
            onPointerLeave={(event) => event.preventDefault()}
          >
            <ul className="grid min-w-max grid-flow-row grid-cols-1 p-1">
              <NavItem link="/profile">
                <CircleUserRound className="h-4 w-4" />
                个人资料
              </NavItem>

              {hasAdmin() && (
                <NavItem link="/admin">
                  <LayoutDashboard className="h-4 w-4" />
                  管理后台
                </NavItem>
              )}

              <li>
                <LogoutButton />
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

type NavItemProps = {
  children: React.ReactNode;
  link: string;
};

function NavItem({ children, link }: NavItemProps) {
  return (
    <li>
      <Link
        to={link}
        className={cn(
          buttonVariants({ variant: "link" }),
          "grid w-full grid-cols-[auto_1fr] gap-2",
        )}
      >
        {children}
      </Link>
    </li>
  );
}
