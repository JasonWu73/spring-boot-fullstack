import { useEffect } from "react";
import EatAndSplit from "@/components/demo/eat-n-split/EatAndSplit.tsx";
import { Toaster } from "@/components/ui/Toaster.tsx";

export default function App() {
  useTheme();

  return (
    <>
      <EatAndSplit />
      <Toaster />
    </>
  );
}

function useTheme() {
  useEffect(() => {
    // 监听暗色主题变化
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // 初始化
    mediaQuery.matches && addDarkBodyClass();

    function handleDarkMode(e: MediaQueryListEvent) {
      if (e.matches) {
        addDarkBodyClass();
        return;
      }

      removeDarkBodyClass();
    }

    mediaQuery.addEventListener("change", handleDarkMode);

    return () => {
      mediaQuery.removeEventListener("change", handleDarkMode);
    };
  }, []);
}

function addDarkBodyClass() {
  document.body.classList.add("dark");
}

function removeDarkBodyClass() {
  document.body.classList.remove("dark");
}