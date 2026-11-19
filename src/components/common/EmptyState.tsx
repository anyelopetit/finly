import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon = 'account_balance_wallet',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { openAddTransaction } = useUIStore()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col items-center justify-center text-center py-16 px-6 gap-4"
    >
      {/* Animated orb */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center animate-orb-breathing">
          <span className="material-symbols-outlined text-primary text-[48px]">{icon}</span>
        </div>
        <div className="absolute -right-1 -bottom-1 w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center shadow-fab">
          <span className="material-symbols-outlined text-on-secondary-fixed text-[16px]">add</span>
        </div>
      </div>

      {/* Text */}
      <div className="space-y-2 max-w-[260px]">
        <h3 className="text-headline-sm font-bold text-on-surface">{title}</h3>
        <p className="text-body-md text-on-surface-variant">{description}</p>
      </div>

      {/* CTA */}
      {actionLabel && (
        <Button
          variant="secondary"
          onClick={onAction ?? openAddTransaction}
          className="mt-2"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
