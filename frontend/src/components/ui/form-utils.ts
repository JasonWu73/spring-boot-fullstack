import { createContext, useContext } from 'react'
import {
  type FieldPath,
  type FieldValues,
  useFormContext
} from 'react-hook-form'

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

function useFormField() {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  }
}

/**
 * 自定义的错误边框样式.
 *
 * @param isError - 是否为错误状态
 * @returns - 错误边框样式类对象, 用于 `cn` 函数
 */
function inputErrorClasses(isError: boolean) {
  return {
    'border-slate-200 dark:border-slate-800 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300':
      !isError,
    'border-red-500 dark:border-red-900 focus-visible:ring-red-500 dark:focus-visible:ring-red-600':
      isError
  }
}

export { FormFieldContext, FormItemContext, useFormField, inputErrorClasses }
