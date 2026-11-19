import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store'
import {
  Wallet,
  Receipt,
  SearchX,
  Plus,
  PiggyBank,
  CreditCard,
  PlusCircle,
  type LucideIcon,
} from 'lucide-react'

interface EmptyStateProps {
  icon?: string | LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

function resolveIcon(icon: string | LucideIcon | undefined) {
  if (typeof icon === 'function') {
    const Icon = icon
    return <Icon className="w-12 h-12 text-primary" />
  }
  switch (icon) {
    case 'receipt_long':
    case 'receipt':
      return <Receipt className="w-12 h-12 text-primary" />
    case 'search_off':
    case 'search_x':
      return <SearchX className="w-12 h-12 text-primary" />
    case 'savings':
    case 'piggy':
      return <PiggyBank className="w-12 h-12 text-primary" />
    case 'credit_score':
    case 'credit_card':
      return <CreditCard className="w-12 h-12 text-primary" />
    default:
      return <Wallet className="w-12 h-12 text-primary" />
  }
}

export function EmptyState({
  icon,
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
          {resolveIcon(icon)}
        </div>
        <div className="absolute -right-1 -bottom-1 w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center shadow-fab">
          <Plus className="w-4 h-4 text-on-secondary-fixed stroke-[3]" />
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
          <PlusCircle className="w-5 h-5 mr-1" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}
