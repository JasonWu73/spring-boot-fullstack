import React from "react";

/**
 * 保存函数或对象的引用，即在拥有最新值的同时，也可作为 `useEffect`、`useMemo` 和 `useCallback` 等 Hook 的依赖项。
 *
 * 这解决了因每次渲染都会创建新函数或对象，从而引发依赖项变化，导致 Hook 无限循环执行的问题。
 *
 * @param objOrFn 函数或对象
 * @returns React.MutableRefObject<T> 不变的引用
 */
export function useSavedRef<T>(objOrFn: T) {
  const ref = React.useRef(objOrFn);

  React.useLayoutEffect(() => {
    ref.current = objOrFn;
  }, [objOrFn]);

  return ref;
}
