import { Check, ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/shared/components/ui/Badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/shared/components/ui/Command";
import { invalidClasses } from "@/shared/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/Popover";
import { cn } from "@/shared/utils/helpers";

interface MultiSelectProps {
  options: Record<"value" | "label", string>[];
  selected: Record<"value" | "label", string>[];
  onChange: React.Dispatch<
    React.SetStateAction<Record<"value" | "label", string>[]>
  >;
  className?: string;
  placeholder?: string;

  isError?: boolean;
  disabled?: boolean;
}

/**
 * 改动较多！
 *
 * {@link https://github.com/shadcn-ui/ui/issues/66 | Multi select ? · Issue #66 · shadcn-ui/ui}
 */
const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    { isError = false, options, selected, onChange, className, ...props },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);

    const handleUnselect = (item: Record<"value" | "label", string>) => {
      onChange(selected.filter((i) => i.value !== item.value));
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            role="combobox"
            aria-expanded={open}
            className={cn(
              "flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300",
              invalidClasses(isError),
              className,
            )}
            onClick={() => setOpen(!open)}
            {...props}
          >
            <div className="flex flex-wrap items-center gap-1">
              {selected.map((item) => (
                <Badge
                  variant="outline"
                  key={item.value}
                  className="flex h-7 items-center gap-1"
                  onClick={() => handleUnselect(item)}
                >
                  {item.label}
                  <div
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleUnselect(item);
                    }}
                  >
                    <X className="h-4 w-4 rounded-sm border-none hover:bg-slate-200 dark:hover:bg-night-1" />
                  </div>
                </Badge>
              ))}

              {selected.length === 0 && (
                <span className="text-slate-500 dark:text-slate-400">
                  {props.placeholder ?? "请选择..."}
                </span>
              )}
            </div>

            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="搜索..." />
            <CommandEmpty>未找到结果</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(
                      selected.some((item) => item.value === option.value)
                        ? selected.filter((item) => item.value !== option.value)
                        : [...selected, option],
                    );
                    setOpen(true);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.some((item) => item.value === option.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
