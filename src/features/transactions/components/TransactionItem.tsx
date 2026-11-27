import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { Transaction } from '@/types'
import { formatCurrency } from '@/lib/calculations'
import { usePrivacyStore, useUIStore } from '@/store'
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
  const { lastCreatedTransactionId, setLastCreatedTransactionId } = useUIStore()

  const isNewlyCreated = lastCreatedTransactionId === transaction.id

  useEffect(() => {
    if (isNewlyCreated) {
      const timer = setTimeout(() => {
        setLastCreatedTransactionId(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isNewlyCreated, setLastCreatedTransactionId])

  const isIncome = transaction.type === 'income'
  const colorClass = isIncome ? categoryColors.income : categoryColors.expense
  const amountColor = isIncome ? 'text-secondary font-bold' : 'text-on-surface font-bold'
  const amountPrefix = isIncome ? '+' : '-'

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: isNewlyCreated ? -12 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: isNewlyCreated ? 0.45 : 0.25,
        ease: [0.42, 0, 0.58, 1],
        layout: {
          duration: 0.38,
          ease: [0.42, 0, 0.58, 1],
        },
      }}
      onClick={() => navigate(`/movimientos/${transaction.id}`)}
      className={cn(
        'relative flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer group',
        isNewlyCreated
          ? 'ring-2 ring-secondary-fixed bg-secondary-fixed/10 shadow-[0_4px_16px_rgba(190,245,50,0.25)]'
          : 'hover:bg-surface-container-low active:bg-surface-container'
      )}
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
          <div className="flex items-center gap-1.5">
            <p className="text-label-lg font-semibold text-on-surface leading-snug">
              {transaction.description ?? transaction.category?.name ?? 'Movimiento'}
            </p>
            <AnimatePresence>
              {isNewlyCreated && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                  className="text-[10px] uppercase tracking-wider font-extrabold bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded-full shadow-sm"
                >
                  Nuevo
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            {transaction.category?.name} &bull;{' '}
            {formatRelativeDate(transaction.date)}
          </p>
        </div>
      </div>

      {/* Amount & Equivalent */}
      <div className="text-right shrink-0 ml-2">
        <p className={cn('text-label-lg leading-tight', amountColor)}>
          {isHidden
            ? '••••••'
            : `${amountPrefix}${formatCurrency(transaction.amount, transaction.currency)}`}
        </p>
        {!isHidden && transaction.equivalent_amount && (
          <p className="text-[11px] text-on-surface-variant font-medium leading-tight mt-0.5">
            ≈ {formatCurrency(transaction.equivalent_amount, transaction.currency === 'USD' ? 'VES' : 'USD')}
          </p>
        )}
        <span className="text-[10px] uppercase font-semibold text-on-surface-variant/70">
          {transaction.currency}
        </span>
      </div>
    </motion.div>
  )
}
