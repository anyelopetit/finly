import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-primary text-on-primary hover:bg-primary/90 shadow-card active:scale-95',
  secondary:
    'bg-secondary-fixed text-on-secondary-fixed shadow-fab active:scale-95 glow-lime',
  ghost: 'bg-transparent text-primary hover:bg-primary/8 active:scale-95',
  outline:
    'border border-outline-variant text-on-surface hover:bg-surface-container-low active:scale-95',
  danger: 'bg-error text-on-error hover:bg-error/90 active:scale-95',
}

const sizes = {
  sm: 'px-4 py-2 text-label-md rounded-full',
  md: 'px-6 py-3 text-label-lg rounded-full',
  lg: 'px-8 py-4 text-body-lg rounded-full',
  icon: 'w-11 h-11 rounded-full flex items-center justify-center',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 select-none cursor-pointer',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          (disabled || loading) && 'opacity-50 pointer-events-none',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
