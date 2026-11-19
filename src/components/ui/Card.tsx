import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode
  variant?: 'default' | 'hero' | 'flat'
  animate?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', animate = true, layoutId, className, children, ...props }, ref) => {
    const base = cn(
      'rounded-lg',
      variant === 'default' && 'bg-surface-container-lowest shadow-card',
      variant === 'hero' && 'bg-inverse-surface text-inverse-on-surface shadow-hero',
      variant === 'flat' && 'bg-surface-container-low',
      className
    )

    if (animate || layoutId) {
      return (
        <motion.div
          ref={ref}
          layoutId={layoutId}
          className={base}
          layout
          {...props}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div ref={ref} className={base} {...(props as any)}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
export { Card }
