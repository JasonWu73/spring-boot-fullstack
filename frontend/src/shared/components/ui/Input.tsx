import React from 'react'

import { cn } from '@/shared/utils/helpers'

type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  type?: 'text' | 'password' | 'search' | 'email' | 'url' | 'tel' | 'number' | 'radio' | 'checkbox' | 'datetime-local' | 'date' | 'time' | 'month' | 'week' | 'file' | 'color' | 'range'
  onValidate?: (validityState: ValidityState) => string | void
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, type = 'text', onValidate, ...props }, ref) {

    function handleValidate(event: React.FormEvent<HTMLInputElement>) {
      if (!onValidate) return

      const input = event.target as HTMLInputElement
      const validityState = input.validity
      const error = onValidate(validityState)
      input.setCustomValidity(error || '')
    }

    return (
      <input
        {...props}
        ref={ref}
        type={type}
        onInvalid={handleValidate}
        onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
        className={cn(
          'font-sans inline-block w-full p-2 text-sm leading-5 text-slate-900 bg-white border border-slate-300 placeholder-slate-400 rounded shadow-sm transition-colors focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-200 disabled:border-slate-200 disabled:text-slate-500 disabled:bg-slate-50 disabled:pointer-events-none disabled:shadow-none invalid:text-rose-500 focus:invalid:border-rose-500 focus:invalid:ring-rose-200 dark:text-slate-200 dark:bg-slate-900 dark:border-slate-500  dark:disabled:text-slate-300 dark:disabled:bg-slate-800 dark:disabled:border-slate-600 dark:focus:border-sky-600 dark:focus:ring-sky-900 dark:invalid:text-rose-500 dark:focus:invalid:border-rose-600 dark:focus:invalid:ring-rose-900',
          type === 'file' && 'file:h-9 file:py-2 file:px-4 file:border-0 file:rounded file:text-sm file:font-medium file:text-slate-50 file:bg-sky-500 hover:file:bg-sky-500/90 hover:file:cursor-pointer dark:file:text-slate-200',
          className
        )}
      />
    )
  }
)
