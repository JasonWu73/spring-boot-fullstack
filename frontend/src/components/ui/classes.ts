import { Size } from "@/components/ui/types.ts";

export function getSizeClasses(size: Size) {
  switch (size) {
    case "sm":
      return "px-2 py-1 text-sm";
    case "lg":
      return "px-6 py-3 text-lg";
    default:
      return "px-4 py-2 text-base";
  }
}
