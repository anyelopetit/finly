import { type InputHTMLAttributes, forwardRef, isValidElement } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, Calendar, Edit3, Lock, Mail, Search, User, ArrowLeftRight } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightAction?: React.ReactNode
}

function renderLeftIcon(icon: React.ReactNode) {
  if (isValidElement(icon)) {
    return icon
  }
  if (typeof icon === 'string') {
    switch (icon) {
      case 'person':
      case 'user':
        return <User className="w-5 h-5" />
      case 'search':
        return <Search className="w-5 h-5" />
      case 'calendar_today':
      case 'calendar':
        return <Calendar className="w-5 h-5" />
      case 'edit_note':
      case 'edit':
        return <Edit3 className="w-5 h-5" />
      case 'mail':
        return <Mail className="w-5 h-5" />
      case 'lock':
        return <Lock className="w-5 h-5" />
      case 'currency_exchange':
        return <ArrowLeftRight className="w-5 h-5" />
      default:
        return null
    }
  }
  return null
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
            <div className="absolute left-3.5 text-on-surface-variant pointer-events-none flex items-center justify-center">
              {renderLeftIcon(leftIcon)}
            </div>
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
            <AlertCircle className="w-3.5 h-3.5" />
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
