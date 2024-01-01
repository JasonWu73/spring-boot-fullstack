import React from "react";

import { useSavedRef } from "@/shared/hooks/use-saved";

type ModifierKey = "ctrlKey" | "shiftKey" | "altKey" | "metaKey";

type Keypress = {
  key: string;
  modifiers?: ModifierKey[];
};

/**
 * 用于监听键盘按键的 Hook。
 *
 * @param keypress 键盘按键配置项
 * @param keypress.key 按键
 * @param keypress.modifiers 修饰键
 * @param callback 按键触发后的回调函数
 */
export function useKeypress(
  { key, modifiers = [] }: Keypress,
  callback: () => void,
) {
  const keypressRef = useSavedRef({ key, modifiers, callback });

  React.useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      const { key, modifiers, callback } = keypressRef.current;

      if (
        event.key?.toLowerCase() === key.toLowerCase() &&
        modifiers.every((modifier) => event[modifier])
      ) {
        callback();
      }
    }

    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, [keypressRef]);
}
