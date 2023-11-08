import React, {useLayoutEffect, useRef} from 'react'

/**
 * 保存回调函数的引用，以便在回调函数中使用最新状态的同时，也可作为 `useEffect`、`useMemo` 和 `useCallback` 等 Hook 的依赖项。
 *
 * <p>注意：返回的引用是一直不变的，真正的值在 `current` 属性中。
 *
 * @template T - 回调函数类型
 *
 * @param callback - 回调函数
 * @returns {React.MutableRefObject<T>} - 保存回调函数引用的 Ref 对象
 */
function useCallbackRef<T>(callback: T): React.MutableRefObject<T> {
  const callbackRef = useRef(callback)

  useLayoutEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return callbackRef
}

/**
 * 保存对象的引用，以便在对象中使用最新状态的同时，也可作为 `useEffect`、`useMemo` 和 `useCallback` 等 Hook 的依赖项。
 *
 * <p>注意：返回的引用是一直不变的，真正的值在 `current` 属性中。
 *
 * @template T - 对象类型
 *
 * @param obj - 对象
 * @returns {React.MutableRefObject<T>} - 保存对象引用的 Ref 对象
 */
function useObjectRef<T>(obj: T): React.MutableRefObject<T> {
  const objRef = useRef(obj)

  useLayoutEffect(() => {
    objRef.current = obj
  }, [obj])

  return objRef
}

export {useCallbackRef, useObjectRef}
