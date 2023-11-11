import React from 'react'

/**
 * 保存回调函数的引用，可在回调函数中使用最新状态的同时，也可作为 `useEffect`、`useMemo` 和 `useCallback` 等 Hook 的依赖项。
 *
 * <p>注意：返回的引用是一直不变的，真正的值在 `current` 属性中。
 */
function useCallbackRef<T>(callback: T) {
  const callbackRef = React.useRef(callback)

  React.useLayoutEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return callbackRef
}

/**
 * 保存对象的引用，可在对象中使用最新状态的同时，也可作为 `useEffect`、`useMemo` 和 `useCallback` 等 Hook 的依赖项。
 *
 * <p>注意：返回的引用是一直不变的，真正的值在 `current` 属性中。
 */
function useObjectRef<T>(obj: T) {
  const objRef = React.useRef(obj)

  React.useLayoutEffect(() => {
    objRef.current = obj
  }, [obj])

  return objRef
}

export { useCallbackRef, useObjectRef }
