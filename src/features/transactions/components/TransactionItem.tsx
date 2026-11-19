import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { Transaction } from '@/types'
import { formatCurrency } from '@/lib/calculations'
import { usePrivacyStore } from '@/store'
import { CategoryIcon } from '@/components/common/CategoryIcon'
import { format, parseISO, isToday, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface TransactionItemProps {
  transaction: Transaction
  index?: number
}

const categoryColors: Record<string, string> = {
  income: 'bg-surface-container-high text-secondary',
  expense: 'bg-primary-fixed text-primary',
}

function formatRelativeDate(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Hoy'
  if (isYesterday(date)) return 'Ayer'
  return format(date, 'd MMM', { locale: es })
}

export function TransactionItem({ transaction, index = 0 }: TransactionItemProps) {
  const navigate = useNavigate()
  const { isHidden } = usePrivacyStore()

  const isIncome = transaction.type === 'income'
  const colorClass = isIncome ? categoryColors.income : categoryColors.expense
  const amountColor = isIncome ? 'text-secondary font-bold' : 'text-on-surface font-bold'
  const amountPrefix = isIncome ? '+' : '-'

  return (
    <motion.div
      layoutId={`transaction-${transaction.id}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      onClick={() => navigate(`/movimientos/${transaction.id}`)}
      className="flex items-center justify-between p-2.5 rounded-DEFAULT hover:bg-surface-container-low active:bg-surface-container transition-colors cursor-pointer group"
    >
      {/* Category icon */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={cn(
            'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0',
            colorClass
          )}
        >
          <CategoryIcon
            name={transaction.category?.icon || transaction.category?.name}
            className="w-5 h-5"
          />
        </motion.div>

        {/* Description + meta */}
        <div>
          <p className="text-label-lg font-semibold text-on-surface leading-snug">
            {transaction.description ?? transaction.category?.name ?? 'Movimiento'}
          </p>
          <p className="text-body-sm text-on-surface-variant">
            {transaction.category?.name} &bull;{' '}
            {formatRelativeDate(transaction.date)}
          </p>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0 ml-2">
        <p className={cn('text-label-lg', amountColor)}>
          {isHidden
            ? '••••••'
            : `${amountPrefix}${formatCurrency(transaction.amount, transaction.currency)}`}
        </p>
        <span className="text-label-sm text-on-surface-variant">
          {transaction.currency}
        </span>
      </div>
    </motion.div>
  )
}
