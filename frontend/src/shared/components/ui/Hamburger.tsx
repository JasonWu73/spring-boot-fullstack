import { ShadButton } from "@/shared/components/ui/ShadButton";
import { cn, tw } from "@/shared/utils/helpers";

type HamburgerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * 汉堡菜单图标，常用于移动端展示顶部导航栏内容。
 */
export function Hamburger({ open, onOpenChange }: HamburgerProps) {
  const line = tw`my-1 h-[2px] w-[1.2rem] bg-white duration-300 group-hover:bg-slate-800 group-hover:dark:bg-white`;

  return (
    <div className="flex items-center sm:hidden">
      <ShadButton
        variant="outline"
        size="icon"
        onClick={() => onOpenChange(!open)}
        className="group flex-col"
      >
        <div className={cn(line, open && "translate-y-[0.625rem] rotate-45")} />
        <div className={cn(line, open ? "opacity-0" : "my-0")} />
        <div
          className={cn(line, open && "-translate-y-[0.625rem] -rotate-45")}
        />
      </ShadButton>
    </div>
  );
}
