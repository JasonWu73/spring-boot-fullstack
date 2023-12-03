import React from 'react'

/**
 * 保存函数或对象的引用，即在拥有最新值的同时，也可作为 `useEffect`、`useMemo` 和 `useCallback` 等 Hook 的依赖项。
 * <p>
 * 这解决了因每次渲染都会创建新函数或对象，从而引发依赖项变化，导致 Hook 无限循环执行的问题。
 *
 * @param objFn 函数或对象
 */
function useSavedRef<T>(objFn: T) {
  const callbackRef = React.useRef(objFn)

  React.useLayoutEffect(() => {
    callbackRef.current = objFn
  }, [objFn])

  return callbackRef
}

export { useSavedRef }
