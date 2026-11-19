import { type InputHTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: string // material symbol name
  rightAction?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightAction, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label-md font-semibold text-on-surface-variant"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-4 material-symbols-outlined text-[20px] text-on-surface-variant pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-DEFAULT bg-surface-container-low border border-transparent',
              'px-4 py-3 text-body-lg text-on-surface placeholder:text-on-surface-variant/60',
              'focus:outline-none focus:border-primary focus:bg-surface-container-lowest',
              'transition-all duration-200',
              leftIcon && 'pl-11',
              rightAction && 'pr-12',
              error && 'border-error bg-error-container/20',
              className
            )}
            {...props}
          />
          {rightAction && (
            <div className="absolute right-3 flex items-center">{rightAction}</div>
          )}
        </div>
        {error && (
          <span className="text-label-sm text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </span>
        )}
        {hint && !error && (
          <span className="text-label-sm text-on-surface-variant">{hint}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// ---- Amount Input (large display for transaction entry) ----
interface AmountInputProps {
  value: string
  onChange: (val: string) => void
  currency: string
  error?: string
}

export function AmountInput({ value, onChange, currency, error }: AmountInputProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-baseline gap-2">
        <span className="text-headline-sm text-on-surface-variant font-semibold">
          {currency}
        </span>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
          className={cn(
            'text-display font-bold text-on-surface bg-transparent border-none outline-none',
            'w-full text-center placeholder:text-on-surface-variant/40',
            error && 'text-error'
          )}
          min="0"
          step="0.01"
        />
      </div>
      {error && (
        <span className="text-label-sm text-error">{error}</span>
      )}
    </div>
  )
}

export { Input }
