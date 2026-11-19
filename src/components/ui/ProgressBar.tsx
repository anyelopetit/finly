import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number // 0-100
  className?: string
  trackClassName?: string
  barClassName?: string
  animated?: boolean
  height?: 'sm' | 'md' | 'lg'
}

const heights = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3',
}

export function ProgressBar({
  value,
  className,
  trackClassName,
  barClassName,
  animated = true,
  height = 'md',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      className={cn(
        'w-full rounded-full overflow-hidden p-0.5',
        heights[height],
        'bg-primary-fixed/50',
        trackClassName,
        className
      )}
    >
      {animated ? (
        <motion.div
          className={cn('h-full rounded-full bg-secondary-fixed shadow-sm', barClassName)}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        />
      ) : (
        <div
          className={cn('h-full rounded-full bg-secondary-fixed shadow-sm', barClassName)}
          style={{ width: `${clamped}%` }}
        />
      )}
    </div>
  )
}
