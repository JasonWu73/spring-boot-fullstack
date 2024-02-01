import React from "react";

import { Hamburger } from "@/shared/components/ui/Hamburger";
import { ModeToggle } from "@/shared/components/ui/ModeToggle";
import { setTheme } from "@/shared/components/ui/theme-signals";
import { PanelFold } from "@/shared/components/layout/panel-fold/PanelFold";
import { AuthSwitch } from "@/shared/components/layout/top-nav-bar/AuthSwitch";
import { Logo } from "@/shared/components/layout/top-nav-bar/Logo";
import { TopNavItem } from "@/shared/components/layout/top-nav-bar/TopNavItem";

type TopNavBarProps = {
  showPanelFold?: boolean;
};

export function TopNavbar({ showPanelFold = false }: TopNavBarProps) {
  const [openHamburger, setOpenHamburger] = React.useState(false);

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    // 当点击页面链接后，应该自动关闭汉堡包导航菜单
    if (e.target instanceof HTMLAnchorElement) {
      setOpenHamburger(false);
    }
  }

  return (
    <nav
      onClick={handleClick}
      className="flex items-center justify-between gap-4 p-2"
    >
      <div className="flex items-center gap-4">
        {showPanelFold && <PanelFold />}

        <Logo />
      </div>

      <TopNavItem open={openHamburger} />

      <div className="flex gap-4">
        <div className="hidden sm:inline-block">
          <AuthSwitch />
        </div>

        <ModeToggle
          setTheme={setTheme}
          className="border-slate-900 focus-visible:ring-slate-300"
        />

        <Hamburger open={openHamburger} onOpenChange={setOpenHamburger} />
      </div>
    </nav>
  );
}
